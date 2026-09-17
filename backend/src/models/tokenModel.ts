import {model, Schema} from "mongoose";
import {IToken} from "../interfaces/IToken";

const tokenSchema = new Schema({
    id: {type:String, required:true},
    accessToken: {type:String, required: true},
    refreshToken: {type:String, required: true},
});
export const Token = model<IToken>("tokens", tokenSchema);