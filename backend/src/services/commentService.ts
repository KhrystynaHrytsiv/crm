import {CommentDto, IComment} from "../interfaces/IComment";
import {commentRepository} from "../repositories/commentRepository";
import {orderService} from "./orderService";
import {CourseStatusEnum} from "../enums/courseStatusEnum";

class CommentService {
    async create(dto: CommentDto, orderId: string, userId: string): Promise<IComment> {
        const comment = await commentRepository.create({...dto, orderId, manager:userId, created_At: new Date()});
        await orderService.update(orderId, {status: CourseStatusEnum.inWork, manager: userId})
        return comment;
    }
    async getAll (orderId:string):Promise<IComment[]>{
        return commentRepository.getAll(orderId);
    }
}
export const commentService = new CommentService();