import { model, Schema } from "mongoose";

import { IComment } from "../../../shared/interfaces/IComment";
import { Order } from "./orderModel";
import { User } from "./userModel";

const commentSchema = new Schema(
    {
        orderId: { type: Schema.Types.ObjectId, ref: Order, required: true },
        comment: { type: String, required: true },
        manager: { type: Schema.Types.ObjectId, ref: User, required: true },
        created_At: { type: Date, required: true },
    },
    { versionKey: false },
);
export const Comment = model<IComment>("comment", commentSchema);
