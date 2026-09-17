import {tokenRepository} from "../repositories/tokenRepository";
import {IToken, TokensPair} from "../interfaces/IToken";
import {TokenPayload} from "../interfaces/IUser";
import jwt from "jsonwebtoken";
import {StatusCode} from "../enums/StatusCode";
import {apiError} from "../error/apiError";
import {config} from "../configs/config";
import {TokenEnum} from "../enums/tokenEnum";
class TokenService {
    generateTokens(payload: TokenPayload): TokensPair {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_LIFETIME });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_LIFETIME });
        return { accessToken, refreshToken }
    }

    verifyTokens(token: string, type: TokenEnum): TokenPayload {
        try {
            let secret: string;
            switch (type) {
                case TokenEnum.access:
                    secret = config.JWT_ACCESS_SECRET
                    break
                case TokenEnum.refresh:
                    secret = config.JWT_REFRESH_SECRET
                    break
                default:
                    throw new apiError("Invalid token type", StatusCode.BAD_REQUEST)
            }
            return jwt.verify(token, secret) as TokenPayload;
        } catch (e) {
            console.error(e);
            throw new apiError("Invalid token", StatusCode.UNAUTHORIZED);
        }
    }

    async isTokenExist (token:string, type: TokenEnum):Promise<boolean>{
        const iToken = await tokenRepository.findByParams({ [type]: token });
        return !!iToken;
    }
    async checkToken (token:string, type: TokenEnum){
        const tokenPayload = tokenService.verifyTokens(token, type);
        const isTokenExist = await tokenService.isTokenExist(token, type);
        if (!isTokenExist) {
            throw new apiError("Invalid token", StatusCode.UNAUTHORIZED);
        }
        return tokenPayload
    }
    async delete (params:Partial<IToken>){
        return tokenRepository.delete(params)
    }
}
export const tokenService = new TokenService();