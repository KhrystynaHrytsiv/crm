import {model, Schema} from "mongoose";
import {IToken} from "../interfaces/IToken";
import {User} from "./userModel";

const tokenSchema = new Schema({
    accessToken: {type:String, required: true},
    refreshToken: {type:String, required: true},
    userId: { type: Schema.Types.ObjectId, required: true, ref: User },
    expiresAt: {type:Date, required:true}
});
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Token = model<IToken>("tokens", tokenSchema);