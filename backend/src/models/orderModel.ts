import { model, Schema, Types } from "mongoose";

import { CourseEnum, CourseFormat } from "../../../shared/enums/CourseEnum";
import { CourseStatusEnum } from "../../../shared/enums/courseStatusEnum";
import { CourseTypeEnum } from "../../../shared/enums/courseTypeEnum";
import { IOrder } from "../../../shared/interfaces/IOrder";
import { Group } from "./groupModel";
import { ManagerRefDoc, User } from "./userModel";

export interface IOrderDoc extends Omit<
    IOrder,
    "_id" | "manager" | "created_at"
> {
    _id: Types.ObjectId;
    created_at: Date;
    manager: Types.ObjectId | null;
}

export type IOrderPopulated = Omit<IOrderDoc, "manager"> & {
    manager: ManagerRefDoc | null;
};

const orderSchema = new Schema(
    {
        id: { type: Number, unique: true, sparse: true },
        name: { type: String },
        surname: { type: String },
        email: { type: String },
        phone: { type: String },
        age: { type: Number },
        course: { type: String, enum: CourseEnum },
        course_format: { type: String, enum: CourseFormat },
        course_type: { type: String, enum: CourseTypeEnum },
        status: { type: String, enum: CourseStatusEnum },
        sum: { type: Number },
        alreadyPaid: { type: Number },
        created_at: { type: Date, required: true },
        group: { type: String, ref: Group },
        msg: { type: String },
        utm: { type: String, default: null },
        manager: { type: Schema.Types.ObjectId, ref: User, default: null },
    },
    { timestamps: false, versionKey: false },
);
export const Order = model<IOrderDoc>("order", orderSchema);
