import {Router} from "express";
import {orderRouter} from "./orderRouter";
import {authRouter} from "./authRouter";
import {authMiddleware} from "../middleware/authMiddleware";
import {TokenEnum} from "../enums/tokenEnum";
import {managerRouter} from "./userRouter";

export const apiRouter = Router();
apiRouter.use('/orders', orderRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/manager', authMiddleware.checkToken(TokenEnum.access), managerRouter)