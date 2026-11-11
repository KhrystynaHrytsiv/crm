import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../../../shared/enums/roleEnum";
import { TokenEnum } from "../../../shared/enums/tokenEnum";
import { TokenPayload } from "../../../shared/interfaces/IToken";
import { StatusCode } from "../enums/StatusCode";
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
                if (!user || !user.is_active || user.is_banned) {
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
