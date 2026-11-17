import { model, Schema, Types } from "mongoose";

import { IComment } from "../../../shared/interfaces/IComment";
import { Order } from "./orderModel";
import { ManagerRefDoc, User } from "./userModel";

export interface ICommentDoc extends Omit<
    IComment,
    "_id" | "orderId" | "manager" | "created_at"
> {
    _id: Types.ObjectId;
    orderId: Types.ObjectId;
    manager: Types.ObjectId;
    created_at: Date;
}

export type ICommentPopulated = Omit<ICommentDoc, "manager"> & {
    manager: ManagerRefDoc;
};

const commentSchema = new Schema(
    {
        orderId: { type: Schema.Types.ObjectId, ref: Order, required: true },
        comment: { type: String, required: true },
        manager: { type: Schema.Types.ObjectId, ref: User, required: true },
        created_at: { type: Date, required: true },
    },
    { versionKey: false },
);
export const Comment = model<ICommentDoc>("comment", commentSchema);
