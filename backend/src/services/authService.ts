import {IUser} from "../interfaces/IUser";
import {TokensPair} from "../interfaces/IToken";
import {tokenService} from "./tokenService";
import {StatusCode} from "../enums/StatusCode";
import {apiError} from "../error/apiError";
import {passwordService} from "./passwordService";
import {userRepository} from "../repositories/userRepository";
import {IAuth} from "../interfaces/IAuth";
import {userService} from "./userService";

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
        const tokens = tokenService.generateTokens({userId: user._id, role: user.role});
        await tokenService.createToken(tokens, user._id);

        return {user, tokens}
    };
    async logout(refreshToken: string) {
        await tokenService.delete({ refreshToken });
    }
    async me(userId:string):Promise<IUser>{
        return await userService.getById(userId);
    }
};
export const authService = new AuthService();