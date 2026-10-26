import { Router } from "express";

import { TokenEnum } from "../enums/tokenEnum";
import { authMiddleware } from "../middleware/authMiddleware";
import { authRouter } from "./authRouter";
import { orderRouter } from "./orderRouter";
import { managerRouter } from "./userRouter";

export const apiRouter = Router();
apiRouter.use(
    "/orders",
    authMiddleware.checkToken(TokenEnum.access),
    orderRouter,
);
apiRouter.use("/auth", authRouter);
apiRouter.use("/manager", managerRouter);
