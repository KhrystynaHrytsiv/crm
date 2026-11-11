import { Router } from "express";

import { TokenEnum } from "../../../shared/enums/tokenEnum";
import { AuthValidator } from "../../../shared/validators/authValidator";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

export const authRouter = Router();
authRouter.post(
    "/login",
    validationMiddleware.validateBody(AuthValidator.login),
    authController.login,
);
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
