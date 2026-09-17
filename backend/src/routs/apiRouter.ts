import {Router} from "express";
import {orderRouter} from "./orderRouter";
import {authRouter} from "./authRouter";
import {managerRouter} from "./userRouter";

export const apiRouter = Router();
apiRouter.use('/orders', orderRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/manager', managerRouter)