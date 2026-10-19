import {model, Schema} from "mongoose";
import {Order} from "./orderModel";
import {User} from "./userModel";
import {IComment} from "../../../shared/interfaces/IComment";

const commentSchema = new Schema({
    orderId: {type: Schema.Types.ObjectId, ref: Order, required:true},
    comment: {type:String, required:true},
    manager: {type:Schema.Types.ObjectId, ref: User, required:true},
    created_At: {type:Date, required:true}
},
    {versionKey:false});
export const Comment = model<IComment>("comment", commentSchema);