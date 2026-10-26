import { Router } from "express";

import { authController } from "../controllers/authController";
import { TokenEnum } from "../enums/tokenEnum";
import { authMiddleware } from "../middleware/authMiddleware";

export const authRouter = Router();
authRouter.post("/login", authController.login);
authRouter.post(
    "/logout",
    authMiddleware.checkToken(TokenEnum.refresh),
    authController.logout,
);
authRouter.get(
    "/me",
    authMiddleware.checkToken(TokenEnum.access),
    authController.me,
);
authRouter.post(
    "/refresh",
    authMiddleware.checkToken(TokenEnum.refresh),
    authController.refresh,
);
