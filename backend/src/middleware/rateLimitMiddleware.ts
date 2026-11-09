import { rateLimit } from "express-rate-limit";

import { StatusCode } from "../enums/StatusCode";

const limitReached = (message: string) => ({
    status: StatusCode.TOO_MANY_REQUESTS,
    message,
});

// Brute-force protection for password guessing
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: limitReached("Too many login attempts, try again in 15 minutes"),
});

// Activation / recovery links are public, so token guessing is limited too
export const actionTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: limitReached("Too many requests, try again later"),
});
