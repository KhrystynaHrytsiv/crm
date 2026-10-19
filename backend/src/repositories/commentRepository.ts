import {IComment} from "../../../shared/interfaces/IComment";
import {Comment} from "../models/commentModel"

class CommentRepository {
   create (dto:IComment):Promise<IComment>{
       return Comment.create(dto)
   }
   getAll (orderId:string):Promise<IComment[]>{
       return Comment.find({orderId}).populate("manager", "surname");
   }
}
export const commentRepository = new CommentRepository();