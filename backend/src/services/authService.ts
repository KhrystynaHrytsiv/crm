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
    async logout(refreshToken: string) {
        await tokenService.delete({ refreshToken });
    }
    // async activate (managerId:string){
    //     const manager = await userService.getById(managerId);
    //     if (manager.role !== RoleEnum.manager){
    //         throw new apiError("User is not a manager", StatusCode.BAD_REQUEST)
    //     }
    //     if (manager.is_Active){
    //         throw new apiError("Manager is already active", StatusCode.BAD_REQUEST)
    //     }
    //     const token = tokenService.generateActionToken({userId: managerId, role: RoleEnum.manager}, ActionTokenType.activate);
    //     await tokenRepository.create({
    //         userId:managerId,
    //     })
    // }
};
export const authService = new AuthService();