interface IToken {
    id:string,
    accessToken:string,
    refreshToken:string,
}
type TokensPair = Pick<IToken, "accessToken" | "refreshToken">;
type RefreshToken = Pick<IToken, "refreshToken">;
export type {TokensPair, IToken, RefreshToken};