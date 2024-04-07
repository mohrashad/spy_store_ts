import rateLimit from "express-rate-limit";

const RateLimitMiddleware = rateLimit({
    limit: 15,
    legacyHeaders: false,
    windowMs: 10 * 60 * 1000,
    standardHeaders: 'draft-7',
    message: 'too many requests, Please try again later',
    headers: true,
})

export { RateLimitMiddleware };