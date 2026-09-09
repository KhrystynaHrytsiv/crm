import {Router} from "express";
import {orderRouter} from "./orderRouter";

export const apiRouter = Router();
apiRouter.use('/orders', orderRouter);