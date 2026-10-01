import {CommentDto, IComment} from "../interfaces/IComment";
import {commentRepository} from "../repositories/commentRepository";
import {orderService} from "./orderService";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";
import {CourseStatusEnum} from "../enums/courseStatusEnum";

class CommentService {
    async create(dto: CommentDto, orderId: string, userId: string): Promise<IComment> {
        const { manager } = await orderService.getById(orderId);
        if (manager && manager.toString() !== userId) {
            throw new apiError("You can`t adjust this order", StatusCode.FORBIDDEN);
        }
        const comment = await commentRepository.create({...dto, orderId, manager:userId, created_At: new Date()});
        await orderService.update(orderId, {status: CourseStatusEnum.inWork, manager: userId})
        return comment;
    }
    async getAll (orderId:string):Promise<IComment[]>{
        return commentRepository.getAll(orderId);
    }
}
export const commentService = new CommentService();