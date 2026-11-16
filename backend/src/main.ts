import dns from "node:dns";

import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { logger } from "../../shared/logger";
import { config } from "./configs/config";
import { swaggerDocument } from "./docs/swagger";
import { StatusCode } from "./enums/StatusCode";
import { apiError } from "./error/apiError";
import { apiRouter } from "./routes/apiRouter";
import { seed } from "./seed/adminSeed";
import { seedData } from "./seed/orderIdSeed";

if (config.DNS_SERVERS.length) {
    dns.setServers(config.DNS_SERVERS);
}

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.FRONTEND_URL }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", apiRouter);
const toClientError = (err: unknown): { status: number; message: string } => {
    if (err instanceof apiError) {
        return { message: err.message, status: err.status };
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
        message: "Internal server error",
        status: StatusCode.INTERNAL_SERVER_ERROR,
    };
};

app.use((err: unknown, req: Request, res: Response) => {
    const { status, message } = toClientError(err);
    if (status >= 500) {
        logger.error({ err, method: req.method, url: req.originalUrl });
    }
    res.status(status).json({ status, message });
});
process.on("uncaughtException", (err) => {
    logger.error(err, "uncaughtException");
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    logger.error(reason, "unhandledRejection");
    process.exit(1);
});
const connection = async () => {
    const maxAttempts = 8;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await mongoose.connect(config.MONGO_URI);
            logger.info("Connection available");
            return;
        } catch (e) {
            logger.error({ error: e, attempt }, "MongoDB connection failed");
            if (attempt === maxAttempts) {
                throw e;
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

const start = async () => {
    try {
        await connection();
        await seed();
        await seedData();
        app.listen(config.PORT, async () => {
            logger.info(`server listen ${config.PORT} port`);
        });
    } catch (e) {
        logger.error(e);
    }
};
void start();
