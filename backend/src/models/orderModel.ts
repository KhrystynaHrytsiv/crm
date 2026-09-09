import {model, Schema} from "mongoose";
import {IOrder} from "../interfaces/IOrder";
import {CourseEnum, CourseFormat} from "../enums/CourseEnum";
import {CourseStatusEnum} from "../enums/courseStatusEnum";

const orderSchema = new Schema({
    id: {type: String, },
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    age: {type: Number, required: true},
    course:{type: String, enum:CourseEnum, required:true},
    format:{type: String, enum:CourseFormat, required:true},
    status:{type: String, enum:CourseStatusEnum,required:true},
    sum:{type:Number, required:true},
    alreadyPaid:{type:Number, required:true},
    group:{type:String, required:true},
    manager:{type:String, required:true}

},
    {timestamps:true, versionKey:false});
export const Order = model<IOrder>('order', orderSchema);
