import { model, Schema } from "mongoose";

import { IGroup } from "../../../shared/interfaces/IGroup";

const groupSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: false, versionKey: false },
);
export const Group = model<IGroup>("group", groupSchema);
