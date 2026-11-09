import dns from "node:dns";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { logger } from "../../shared/logger";
import { config } from "./configs/config";
import { swaggerDocument } from "./docs/swagger";
import { StatusCode } from "./enums/StatusCode";
import { apiError } from "./error/apiError";
import { apiRouter } from "./routs/apiRouter";
import { seed } from "./seed/adminSeed";
import { seedOrderData } from "./seed/orderDataSeed";
import { seedOrderIds } from "./seed/orderIdSeed";

if (config.DNS_SERVERS.length) {
    dns.setServers(config.DNS_SERVERS);
}

export const app = express();
// Swagger UI ships inline scripts, so it is mounted before the strict CSP from helmet
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(helmet());
app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.get("/health", (req: Request, res: Response) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(isDbConnected ? StatusCode.OK : 503).json({
        status: isDbConnected ? "ok" : "db unavailable",
    });
});
app.use("/", apiRouter);

app.use((req: Request, res: Response) => {
    res.status(StatusCode.NOT_FOUND).json({
        status: StatusCode.NOT_FOUND,
        message: "Route not found",
    });
});

// Internal error details (Mongo, stack traces) are logged, never sent to the client
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

process.on("unhandledRejection", (reason) => {
    logger.error(reason, "unhandledRejection");
});
process.on("uncaughtException", (err) => {
    logger.fatal(err, "uncaughtException");
    process.exit(1);
});

const connection = async () => {
    let dbCon = false;
    while (!dbCon) {
        try {
            await mongoose.connect(config.MONGO_URI);
            dbCon = true;
            logger.info("Connection available");
        } catch (e) {
            logger.error(e);
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

const start = async () => {
    try {
        await connection();
        await seed();
        await seedOrderIds();
        await seedOrderData();
        const server = app.listen(config.PORT, () => {
            logger.info(`server listen ${config.PORT} port`);
        });

        const shutdown = (signal: string) => {
            logger.info(`${signal} received, shutting down`);
            server.close(async () => {
                await mongoose.disconnect();
                process.exit(0);
            });
            // force exit if open connections don't close in time
            setTimeout(() => process.exit(1), 10000).unref();
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (e) {
        logger.fatal(e);
        process.exit(1);
    }
};
void start();
