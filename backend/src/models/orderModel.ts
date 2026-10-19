import {model, Schema} from "mongoose";
import {IOrder} from "../../../shared/interfaces/IOrder";
import {CourseEnum, CourseFormat} from "../enums/CourseEnum";
import {CourseStatusEnum} from "../enums/courseStatusEnum";
import {User} from "./userModel";

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
    created_at:{type:Date, required:true},
    group:{type:String, required:true},
    msg:{type:String,},
    utm:{type:String, default: null},
    manager: {type: Schema.Types.ObjectId, ref: User, default: null}

},
    {timestamps:false, versionKey:false});
export const Order = model<IOrder>('order', orderSchema);
