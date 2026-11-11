import { model, Schema } from "mongoose";

import { RoleEnum } from "../../../shared/enums/roleEnum";
import { IUser } from "../../../shared/interfaces/IUser";

const userSchema = new Schema(
    {
        name: { type: String },
        surname: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
        passwordChangedAt: { type: Date, default: null },
        role: { type: String, enum: RoleEnum },
        is_active: { type: Boolean, default: false },
        is_banned: { type: Boolean, default: false },
        last_login: { type: Date, default: null },
    },
    {
        timestamps: false,
        versionKey: false,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.password;
                delete ret.passwordChangedAt;
                return ret;
            },
        },
    },
);
export const User = model<IUser>("user", userSchema);
