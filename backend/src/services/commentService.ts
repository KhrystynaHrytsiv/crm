import { CommentDto, IComment } from "../../../shared/interfaces/IComment";
import { CourseStatusEnum } from "../enums/courseStatusEnum";
import { commentRepository } from "../repositories/commentRepository";
import { orderService } from "./orderService";

class CommentService {
    async create(
        dto: CommentDto,
        orderId: string,
        userId: string,
    ): Promise<IComment> {
        const order = await orderService.getById(orderId);
        const comment = await commentRepository.create({
            ...dto,
            orderId,
            manager: userId,
            created_At: new Date(),
        });
        const isNewOrder =
            !order.status || order.status === CourseStatusEnum.new;
        await orderService.update(
            orderId,
            isNewOrder ? { status: CourseStatusEnum.inWork } : {},
            userId,
        );
        return comment;
    }
    async getAll(orderId: string): Promise<IComment[]> {
        return commentRepository.getAll(orderId);
    }
}
export const commentService = new CommentService();
