import {NextFunction, Request, Response} from 'express';
import {apiError} from '../error/apiError';
import {TokenEnum} from '../enums/tokenEnum';
import {userService} from '../services/userService';
import {tokenService} from '../services/tokenService';
import {StatusCode} from "../enums/StatusCode";
import {TokenPayload} from "../../../shared/interfaces/IToken";
import {RoleEnum} from "../enums/roleEnum";
import {orderService} from "../services/orderService";

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
                    const user = await userService.getById(tokenPayload.userId);
                    if (!user.is_Active) {
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
    hasPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = res.locals.tokenPayload as TokenPayload;
            if (role !== RoleEnum.admin ) {
                throw new apiError("No has permission", StatusCode.FORBIDDEN);
            }
            next();
        } catch (e) {
            next(e);
        }
    }

    async canModify(req: Request, res: Response, next: NextFunction){
        try{
          const orderId = req.params.orderId as string;
            const {userId} = res.locals.tokenPayload as TokenPayload;
            const {manager} = await orderService.getById(orderId);
            if (manager && manager.toString() !== userId) {
                throw new apiError("You can`t adjust this order", StatusCode.FORBIDDEN);
            }
            next();
        }catch (e) {

           next(e);
        }
    }

}
export const authMiddleware = new AuthMiddleware();