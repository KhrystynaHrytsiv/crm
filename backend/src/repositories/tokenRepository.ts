import { IToken } from "../../../shared/interfaces/IToken";
import { Token } from "../models/tokenModel";

class TokenRepository {
    create(dto: any): Promise<IToken> {
        return Token.create(dto);
    }
    findByParams(params: Partial<IToken>): Promise<IToken | null> {
        return Token.findOne(params);
    }
    public delete(params: Partial<IToken>) {
        return Token.deleteOne(params);
    }
}
export const tokenRepository = new TokenRepository();
