import {Router} from "express";
import {orderRouter} from "./orderRouter";
import {authRouter} from "./authRouter";

export const apiRouter = Router();
apiRouter.use('/orders', orderRouter);
apiRouter.use('/auth', authRouter);