import * as fs from 'fs-extra';
import { isInstance } from 'class-validator';
import {
    Middleware, ExpressErrorMiddlewareInterface,
    HttpError, BadRequestError, ForbiddenError,
    InternalServerError, MethodNotAllowedError, NotAcceptableError, NotFoundError, UnauthorizedError
} from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';
import { ApiError } from '../utils/handlers/api.error.handler';
import { HTTP_STATUS_CODE } from '../utils/handlers/api.response.handler';
import { LoggerService } from '../utils/logger/loggerService';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError } from '@prisma/client/runtime';

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    async error(error: any, request: Request, response: Response, next: any) {
        if (!error || !request || !response) throw new Error('One of the parameters is falsy');

        let status: HTTP_STATUS_CODE = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        const log = Container.get(LoggerService);
        const apiError = new ApiError(response);
        apiError.withData(error.message || 'Unknown error');
        apiError.withErrorName(error.name || 'UnknownError');
        apiError.withData(error.message);
        apiError.withErrorName(error.name);

        if (error instanceof PrismaClientKnownRequestError ||
            error instanceof PrismaClientUnknownRequestError ||
            error instanceof PrismaClientRustPanicError ||
            error instanceof PrismaClientInitializationError ||
            error instanceof PrismaClientValidationError
        ) {
            if (error.message) apiError.withData(error.message)
            else apiError.withData('Database is down');
        }

        if (error instanceof HttpError ||
            error instanceof BadRequestError ||
            error instanceof ForbiddenError ||
            error instanceof InternalServerError ||
            error instanceof MethodNotAllowedError ||
            error instanceof NotAcceptableError ||
            error instanceof NotFoundError ||
            error instanceof UnauthorizedError) {
            status = error.httpCode;
        }


        if (isInstance(error, HttpError) && error.message === `Invalid body, check 'errors' property for more info.`) {
            apiError.withData(Object.values(error.errors[0]?.constraints) || 'Unknown error');
        }

        if (request.files) {
            log.info('Removing uploaded files (' + (request.files?.length || 0) + ') because operation failed');
            for (const i of Object.keys(request.files || {})) {
                log.info('Removing uploaded files (' + request.files.length + ') because operation failed');
                try {
                    const reqFiles: any = request.files;
                    const fileExists = await fs.pathExists(reqFiles[i]?.path);
                    if (fileExists) {
                        await fs.unlink(reqFiles[i]?.path);
                        log.info(`Done removing file (${parseInt(i) + 1})`);
                    }
                } catch (error: any) {
                    log.error(`Something went wrong deleting uploaded files (${i + 1})`);
                    log.error(error.stack);
                }
            }
        }

        apiError.withStatusCode(status);

        if (status >= 500) {
            console.log(process.env.NODE_ENV);
            log.error(error.stack || 'Unknown stack');
            if (process.env.NODE_ENV !== 'production') {
                apiError.withStackTrace(error.stack || 'Unknown stack');
                apiError.withStackTrace(error.stack);
            }
        }

        console.log(error);
        

        return apiError.build();
    }
}