import { Service } from 'typedi';
import rateLimit from "express-rate-limit";
import { Response, Request } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

const rateLimitMiddleware = rateLimit({
    limit: 100,
    legacyHeaders: false,
    windowMs: 10 * 60 * 1000,
    standardHeaders: 'draft-7',
    message: 'too many requests, Please try again later',
    headers: true,
})

@Middleware({ type: 'before' })
@Service()
export class RateLimitMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any): any {
    rateLimitMiddleware(request, response, next)
  }
}