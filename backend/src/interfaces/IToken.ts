import {RoleEnum} from "../enums/roleEnum";

interface IToken {
    id:string,
    accessToken:string,
    refreshToken:string,
    expiresAt:Date,
}
type TokensPair = Pick<IToken, "accessToken" | "refreshToken">;

type RefreshToken = Pick<IToken, "refreshToken">;
interface TokenPayload {
    userId:string;
    role: RoleEnum;
}
export type {TokensPair, IToken, RefreshToken, TokenPayload};