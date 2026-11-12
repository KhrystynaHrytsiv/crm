import dns from "node:dns";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { logger } from "../../shared/logger";
import { config } from "./configs/config";
import { swaggerDocument } from "./docs/swagger";
import { StatusCode } from "./enums/StatusCode";
import { apiError } from "./error/apiError";
import { apiRouter } from "./routes/apiRouter";
import { seed } from "./seed/adminSeed";
import { seedOrderIds } from "./seed/orderIdSeed";

if (config.DNS_SERVERS.length) {
    dns.setServers(config.DNS_SERVERS);
}

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.FRONTEND_URL }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", apiRouter);
const toClientError = (err: any): { status: number; message: string } => {
    if (err instanceof apiError) {
        return { status: err.status, message: err.message };
    }
    if (err?.type === "entity.parse.failed") {
        return { status: StatusCode.BAD_REQUEST, message: "Invalid JSON body" };
    }
    if (err?.type === "entity.too.large") {
        return { status: 413, message: "Request body is too large" };
    }
    if (err?.name === "CastError") {
        return { status: StatusCode.BAD_REQUEST, message: "Invalid value" };
    }
    if (err?.code === 11000) {
        return { status: StatusCode.CONFLICT, message: "Already exists" };
    }
    return { status: 500, message: "Internal server error" };
};

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
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
        await seedOrderIds();
        app.listen(config.PORT, async () => {
            logger.info(`server listen ${config.PORT} port`);
        });
    } catch (e) {
        logger.error(e);
    }
};
void start();
