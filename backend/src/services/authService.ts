import { TokenEnum } from "../../../shared/enums/tokenEnum";
import { IAuth } from "../../../shared/interfaces/IAuth";
import { TokensPair } from "../../../shared/interfaces/IToken";
import { IUser } from "../../../shared/interfaces/IUser";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";
import { userRepository } from "../repositories/userRepository";
import { passwordService } from "./passwordService";
import { tokenService } from "./tokenService";
import { userService } from "./userService";

class AuthService {
    async login(dto: IAuth): Promise<{ tokens: TokensPair; user: IUser }> {
        const user = await userRepository.getByEmail(dto.email);
        if (
            !user ||
            !user.password ||
            !(await passwordService.comparePassword(
                dto.password,
                user.password,
            )) ||
            !user.is_active ||
            user.is_banned
        ) {
            throw new apiError(
                "Invalid email or password",
                StatusCode.UNAUTHORIZED,
            );
        }
        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });
        await tokenService.createToken(tokens, user._id);
        const updatedUser = await userService.update(user._id, {
            last_login: new Date(),
        });
        return { user: updatedUser, tokens };
    }
    async logout(refreshToken: string) {
        await tokenService.delete({ refreshToken });
    }
    async me(userId: string): Promise<IUser> {
        return await userService.getById(userId);
    }
    async refresh(refreshToken: string) {
        const tokenPayload = await tokenService.checkToken(
            refreshToken,
            TokenEnum.refresh,
        );
        await tokenService.delete({ refreshToken });
        const tokens = tokenService.generateTokens({
            userId: tokenPayload.userId,
            role: tokenPayload.role,
        });
        await tokenService.createToken(tokens, tokenPayload.userId);
        return tokens;
    }
}
export const authService = new AuthService();
