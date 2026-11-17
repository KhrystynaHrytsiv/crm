import { model, Schema, Types } from "mongoose";

import { RoleEnum } from "../../../shared/enums/roleEnum";
import { IUser } from "../../../shared/interfaces/IUser";

export interface IUserDoc extends Omit<IUser, "_id" | "last_login"> {
    _id: Types.ObjectId;
    password: string;
    passwordChangedAt: Date | null;
    last_login: Date | null;
}

export type ManagerRefDoc = Pick<IUserDoc, "_id" | "surname">;

const userSchema = new Schema(
    {
        id: { type: Number, unique: true, sparse: true },
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
            transform: (_doc: unknown, ret: Record<string, unknown>) => {
                delete ret.password;
                delete ret.passwordChangedAt;
                return ret;
            },
        },
    },
);
export const User = model<IUserDoc>("user", userSchema);
