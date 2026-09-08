import {model, Schema} from "mongoose";
import {IUser} from "../interfaces/IUser";

const userSchema = new Schema({
    id: {type: String, },
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    age: {type: Number, required: true},

});
export const User = model<IUser>('user', userSchema);
