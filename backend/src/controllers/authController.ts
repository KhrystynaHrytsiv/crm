import {Request, Response, NextFunction} from "express";
import {IAuth} from "../interfaces/IAuth";
import {authService} from "../services/authService";
import {StatusCode} from "../enums/StatusCode";
import {RefreshToken} from "../interfaces/IToken";
class AuthController {
    async login (req:Request, res:Response, next:NextFunction){
        try {
            const body = req.body as IAuth;
            const user = await authService.login(body);
            res.status(StatusCode.OK).json(user);
        }catch (e) {
            next(e);
        }
    }
    async logout(req:Request, res:Response, next:NextFunction){
        try{
            const { refreshToken } = res.locals as RefreshToken;
          await authService.logout(refreshToken)
            res.status(StatusCode.NO_CONTENT).end();
        }catch (e) {
            next(e);
        }
    }
}
export const authController = new AuthController();