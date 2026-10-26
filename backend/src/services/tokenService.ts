import jwt, { JwtPayload } from "jsonwebtoken";

import {
    IToken,
    TokenPayload,
    TokensPair,
} from "../../../shared/interfaces/IToken";
import { logger } from "../../../shared/logger";
import { config } from "../configs/config";
import { StatusCode } from "../enums/StatusCode";
import { ActionTokenType, TokenEnum } from "../enums/tokenEnum";
import { apiError } from "../error/apiError";
import { tokenRepository } from "../repositories/tokenRepository";

class TokenService {
    generateTokens(payload: TokenPayload): TokensPair {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_LIFETIME,
        });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
            expiresIn: config.JWT_REFRESH_LIFETIME,
        });
        return { accessToken, refreshToken };
    }

    verifyTokens(
        token: string,
        type: TokenEnum | ActionTokenType,
    ): TokenPayload {
        try {
            let secret: string;
            switch (type) {
                case TokenEnum.access:
                    secret = config.JWT_ACCESS_SECRET;
                    break;
                case TokenEnum.refresh:
                    secret = config.JWT_REFRESH_SECRET;
                    break;
                case ActionTokenType.activate:
                    secret = config.JWT_ACTIVATE_SECRET;
                    break;
                case ActionTokenType.recovery:
                    secret = config.JWT_RECOVERY_SECRET;
                    break;
                default:
                    throw new apiError(
                        "Invalid token type",
                        StatusCode.BAD_REQUEST,
                    );
            }
            return jwt.verify(token, secret) as TokenPayload;
        } catch (e) {
            logger.error(e);
            throw new apiError("Invalid token", StatusCode.UNAUTHORIZED);
        }
    }

    async isTokenExist(token: string, type: TokenEnum): Promise<boolean> {
        const iToken = await tokenRepository.findByParams({ [type]: token });
        return !!iToken;
    }
    async checkToken(token: string, type: TokenEnum) {
        const tokenPayload = tokenService.verifyTokens(token, type);
        const isTokenExist = await tokenService.isTokenExist(token, type);
        if (!isTokenExist) {
            throw new apiError("Invalid token", StatusCode.UNAUTHORIZED);
        }
        return tokenPayload;
    }
    async delete(params: Partial<IToken>) {
        return tokenRepository.delete(params);
    }
    public generateActionToken(
        payload: TokenPayload,
        type: ActionTokenType,
    ): string {
        let secret: string;
        let expiresIn: any;
        switch (type) {
            case ActionTokenType.activate:
                secret = config.JWT_ACTIVATE_SECRET;
                expiresIn = config.JWT_ACTIVATE_LIFETIME;
                break;
            case ActionTokenType.recovery:
                secret = config.JWT_RECOVERY_SECRET;
                expiresIn = config.JWT_RECOVERY_LIFETIME;
                break;
            default:
                throw new apiError(
                    "invalid action token type",
                    StatusCode.BAD_REQUEST,
                );
        }
        return jwt.sign(payload, secret, { expiresIn });
    }
    public async createToken(tokenPair: TokensPair, userId: string) {
        const decoded = jwt.decode(tokenPair.refreshToken) as JwtPayload;
        if (!decoded.exp) {
            throw new apiError(
                "Invalid refresh token",
                StatusCode.UNAUTHORIZED,
            );
        }
        return await tokenRepository.create({
            ...tokenPair,
            userId,
            expiresAt: new Date(decoded.exp * 1000),
        });
    }
}
export const tokenService = new TokenService();
