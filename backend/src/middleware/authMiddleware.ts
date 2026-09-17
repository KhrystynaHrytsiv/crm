import {NextFunction, Request, Response} from 'express';
import {apiError} from '../error/apiError';
import {TokenEnum} from '../enums/tokenEnum';
import {userService} from '../services/userService';
import {tokenService} from '../services/tokenService';
import {StatusCode} from "../enums/StatusCode";

class AuthMiddleware {
    checkToken (tokenType:TokenEnum){
        return async (req: Request, res: Response, next: NextFunction) =>{
            try{
                const authorization = req.headers.authorization;
                if(!authorization){
                    throw new apiError('No token provided', StatusCode.UNAUTHORIZED)
                }
                const [type, token] = authorization.split(" ");
                if (type !== "Bearer" || !token) {
                    throw new apiError(
                        "Invalid authorization header",
                        StatusCode.UNAUTHORIZED,
                    );
                }

                const tokenPayload = await tokenService.checkToken(token, tokenType);
                res.locals.tokenPayload = tokenPayload;
                if(tokenType === TokenEnum.access){
                    const user = await userService.getById(tokenPayload.id);
                    if (!user.is_active) {
                        throw new apiError("Account is inactive", StatusCode.FORBIDDEN,);
                    }
                }
                if(tokenType === TokenEnum.refresh){
                    const isTokenExist = await tokenService.isTokenExist(token, TokenEnum.refresh);
                    if (!isTokenExist) {
                        throw new apiError("Invalid token", StatusCode.UNAUTHORIZED);
                    }
                    res.locals.refreshToken = token;
                }
                next()
            }catch (e) {
                next(e);
            }
        }
    }
}
export const authMiddleware = new AuthMiddleware();