import { NextFunction, Request, Response } from "express";

import { TokenPayload } from "../../../shared/interfaces/IToken";
import { RoleEnum } from "../enums/roleEnum";
import { StatusCode } from "../enums/StatusCode";
import { TokenEnum } from "../enums/tokenEnum";
import { apiError } from "../error/apiError";
import { userRepository } from "../repositories/userRepository";
import { tokenService } from "../services/tokenService";

class AuthMiddleware {
    checkToken(tokenType: TokenEnum) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authorization = req.headers.authorization;
                if (!authorization) {
                    throw new apiError(
                        "No token provided",
                        StatusCode.UNAUTHORIZED,
                    );
                }
                const [type, token] = authorization.split(" ");
                if (type !== "Bearer" || !token) {
                    throw new apiError(
                        "Invalid authorization header",
                        StatusCode.UNAUTHORIZED,
                    );
                }

                const tokenPayload = await tokenService.checkToken(
                    token,
                    tokenType,
                );
                res.locals.tokenPayload = tokenPayload;
                const user = await userRepository.getById(tokenPayload.userId);
                // 401 (not 403) so the client drops the session and goes to login
                if (!user || !user.is_Active || user.is_Banned) {
                    throw new apiError(
                        "Account is inactive or banned",
                        StatusCode.UNAUTHORIZED,
                    );
                }
                if (tokenType === TokenEnum.refresh) {
                    res.locals.refreshToken = token;
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
    hasPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = res.locals.tokenPayload as TokenPayload;
            if (role !== RoleEnum.admin) {
                throw new apiError("No has permission", StatusCode.FORBIDDEN);
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}
export const authMiddleware = new AuthMiddleware();
