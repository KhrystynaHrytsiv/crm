import { model, Schema, Types } from "mongoose";

import { IGroup } from "../../../shared/interfaces/IGroup";

export interface IGroupDoc extends Omit<IGroup, "_id"> {
    _id: Types.ObjectId;
}

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
    },
    { timestamps: false, versionKey: false },
);
export const Group = model<IGroupDoc>("group", groupSchema);
