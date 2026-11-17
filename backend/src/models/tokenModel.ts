import { model, Schema, Types } from "mongoose";

import { TokensPair } from "../../../shared/interfaces/IToken";
import { User } from "./userModel";

export interface ITokenDoc extends TokensPair {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    expiresAt: Date;
}

const tokenSchema = new Schema({
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: User },
    expiresAt: { type: Date, required: true },
});
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Token = model<ITokenDoc>("tokens", tokenSchema);
