import { RoleEnum } from "../enums/roleEnum";

interface TokensPair {
    accessToken: string;
    refreshToken: string;
}
type RefreshToken = Pick<TokensPair, "refreshToken">;
interface TokenPayload {
    userId: string;
    role: RoleEnum;
    iat?: number;
    exp?: number;
}
export type { RefreshToken, TokenPayload, TokensPair };
