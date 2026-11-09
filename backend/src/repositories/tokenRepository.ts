import { IToken } from "../../../shared/interfaces/IToken";
import { Token } from "../models/tokenModel";

class TokenRepository {
    create(dto: any): Promise<IToken> {
        return Token.create(dto);
    }
    findByParams(params: Partial<IToken>): Promise<IToken | null> {
        return Token.findOne(params);
    }
    delete(params: Partial<IToken>) {
        return Token.deleteOne(params);
    }
    deleteAllByUserId(userId: string) {
        return Token.deleteMany({ userId });
    }
}
export const tokenRepository = new TokenRepository();
