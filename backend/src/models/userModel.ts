import { model, Schema } from "mongoose";

import { IUser } from "../../../shared/interfaces/IUser";
import { RoleEnum } from "../enums/roleEnum";

const userSchema = new Schema(
    {
        name: { type: String },
        surname: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
        passwordChangedAt: { type: Date, default: null },
        role: { type: String, enum: RoleEnum },
        is_Active: { type: Boolean, default: false },
        is_Banned: { type: Boolean, default: false },
        last_login: { type: Date, default: null },
    },
    {
        timestamps: false,
        versionKey: false,
        toJSON: {
            transform: (doc: any, ret: any) => {
                delete (ret as any).password;
                delete (ret as any).passwordChangedAt;
                return ret;
            },
        },
    },
);
export const User = model<IUser>("user", userSchema);
