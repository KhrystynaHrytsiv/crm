import {Router} from "express";
import {authController} from "../controllers/authController";
import {authMiddleware} from "../middleware/authMiddleware";
import {TokenEnum} from "../enums/tokenEnum";

export const authRouter = Router();
authRouter.post('/login', authController.login);
authRouter.post('/logout', authMiddleware.checkToken(TokenEnum.refresh), authController.logout);