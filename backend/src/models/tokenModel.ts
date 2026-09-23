import {model, Schema} from "mongoose";
import {IToken} from "../interfaces/IToken";

const tokenSchema = new Schema({
    accessToken: {type:String, required: true},
    refreshToken: {type:String, required: true},
    expiresAt: {type:Date, required:true}
});
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Token = model<IToken>("tokens", tokenSchema);