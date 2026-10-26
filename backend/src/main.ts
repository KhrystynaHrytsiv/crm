import dns from "node:dns";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { logger } from "../../shared/logger";
import { config } from "./configs/config";
import { swaggerDocument } from "./docs/swagger";
import { apiError } from "./error/apiError";
import { apiRouter } from "./routs/apiRouter";
import { seed } from "./seed/adminSeed";
import { seedOrderIds } from "./seed/orderIdSeed";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", apiRouter);
app.use((err: apiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message ?? "Something went wrong";
    res.status(status).json({ status, message });
});
process.on("uncaughtException", (err) => {
    logger.error(err, "uncaughtException");
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
            await new Promise((resolve) => setTimeout(resolve, 3000));
            logger.error(e);
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
