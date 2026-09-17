import {model, Schema} from "mongoose";
import {RoleEnum} from "../enums/roleEnum";
import {IUser} from "../interfaces/IUser";

const userSchema = new Schema({
    userId: {type:String, required:true},
    email: {type:String, unique:true},
    password: {type: String, required: true},
    role: {type:String, enum: RoleEnum,},
    is_Active:{type:Boolean, default: false}
},
    {timestamps: false, versionKey:false, toJSON:{
        transform: (doc, ret) => {
            delete (ret as any).passsword;
            return ret
        }
        }});
export const User = model<IUser>("user", userSchema);