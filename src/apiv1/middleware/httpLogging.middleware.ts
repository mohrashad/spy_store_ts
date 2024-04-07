import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Response, Request } from 'express';
import morgan from 'morgan';
import { morganOption } from '../utils/logger/loggerService';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any): any {
    const morganLevel = process.env.NODE_ENV !== 'production' ? 'dev' : 'common';
    morgan(morganLevel, morganOption)(request, response, next);
  }
}