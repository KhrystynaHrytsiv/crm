import { Types } from "mongoose";

import { ITokenDoc, Token } from "../models/tokenModel";

class TokenRepository {
    create(dto: Omit<ITokenDoc, "_id">): Promise<ITokenDoc> {
        return Token.create(dto);
    }
    findByParams(params: Partial<ITokenDoc>): Promise<ITokenDoc | null> {
        return Token.findOne(params);
    }
    delete(params: Partial<ITokenDoc>) {
        return Token.deleteOne(params);
    }
    deleteAllByUserId(userId: string | Types.ObjectId) {
        return Token.deleteMany({ userId });
    }
}
export const tokenRepository = new TokenRepository();
