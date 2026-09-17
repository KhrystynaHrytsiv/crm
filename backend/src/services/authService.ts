import {IUser} from "../interfaces/IUser";
import {TokensPair} from "../interfaces/IToken";
import {tokenRepository} from "../repositories/tokenRepository";
import {tokenService} from "./tokenService";
import {StatusCode} from "../enums/StatusCode";
import {apiError} from "../error/apiError";
import {passwordService} from "./passwordService";
import {userRepository} from "../repositories/userRepository";
import {IAuth} from "../interfaces/IAuth";

class AuthService {
    async login(dto:IAuth):Promise<{tokens:TokensPair, user:IUser}>{
        const user = await userRepository.getByEmail(dto.email);
        if (!user){
            throw new apiError("Invalid email or password", StatusCode.UNAUTHORIZED)
        }
        const isValidPassword = await passwordService.comparePassword(dto.password, user.password);
        if (!isValidPassword){
            throw new apiError("Invalid email or password", StatusCode.UNAUTHORIZED)
        }
        if(!user.is_Active){
            throw new apiError("Account is inactive", StatusCode.FORBIDDEN)
        }
        const tokens = tokenService.generateTokens({userId: user.id, role: user.role});
        await tokenRepository.create({...tokens, userId: user.id})
        return {user, tokens}
    };
    public async logout(refreshToken: string) {
        await tokenService.delete({ refreshToken });
    }
};
export const authService = new AuthService();