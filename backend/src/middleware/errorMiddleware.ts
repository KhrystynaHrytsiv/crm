import { ErrorRequestHandler } from "express";

import { logger } from "../../../shared/logger";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";

const toClientError = (err: unknown) => {
    if (err instanceof apiError) {
        return {
            message: err.message,
            status: err.status,
        };
    }

    if (typeof err === "object" && err !== null) {
        const error = err as {
            type?: string;
            name?: string;
            code?: number;
        };

        if (error.type === "entity.parse.failed") {
            return {
                message: "Invalid JSON body",
                status: StatusCode.BAD_REQUEST,
            };
        }

        if (error.type === "entity.too.large") {
            return {
                message: "Request body is too large",
                status: StatusCode.PAYLOAD_TOO_LARGE,
            };
        }

        if (error.name === "CastError") {
            return {
                message: "Invalid value",
                status: StatusCode.BAD_REQUEST,
            };
        }

        if (error.code === 11000) {
            return {
                message: "Already exists",
                status: StatusCode.CONFLICT,
            };
        }
    }

    return {
        status: StatusCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
    };
};

export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
    const { status, message } = toClientError(err);

    if (status >= 500) {
        logger.error({
            err,
            method: req.method,
            url: req.originalUrl,
        });
    }

    res.status(status).json({ status, message });
};
