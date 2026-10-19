import {NextFunction, Request, Response} from "express";
import {IAuth} from "../../../shared/interfaces/IAuth";
import {authService} from "../services/authService";
import {StatusCode} from "../enums/StatusCode";
import {RefreshToken, TokenPayload} from "../../../shared/interfaces/IToken";

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
    async me (req: Request, res:Response, next: NextFunction){
        try {
            const {userId} = res.locals.tokenPayload as TokenPayload;
            const user = await authService.me(userId);
            res.status(StatusCode.OK).json(user);
        }catch (e) {
            next(e);
        }
    }
    async refresh (req: Request, res:Response, next: NextFunction){
        try{
            const refreshToken = res.locals.refreshToken as string;
            const refresh = await authService.refresh(refreshToken);
            res.status(StatusCode.OK).json(refresh)
        }catch (e) {
            next(e);
        }
    }

}
export const authController = new AuthController();