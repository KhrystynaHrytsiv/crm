import {IComment} from "../interfaces/IComment";
import {Comment} from "../models/commentModel"

class CommentRepository {
   create (dto:IComment):Promise<IComment>{
       return Comment.create(dto)
   }
   getAll (orderId:string):Promise<IComment[]>{
       return Comment.find({orderId})
   }
}
export const commentRepository = new CommentRepository();