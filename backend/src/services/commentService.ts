import { CommentDto, IComment } from "../../../shared/interfaces/IComment";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";
import { commentRepository } from "../repositories/commentRepository";
import { orderRepository } from "../repositories/orderRepository";

class CommentService {
    async create(
        dto: CommentDto,
        orderId: string,
        userId: string,
    ): Promise<IComment> {
        const order = await orderRepository.chooseOrder(orderId, userId);
        if (!order) {
            throw new apiError(
                "Order is already assigned to another manager or cannot be modified",
                StatusCode.FORBIDDEN,
            );
        }
        return commentRepository.create({
            ...dto,
            orderId,
            manager: userId,
            created_At: new Date(),
        });
    }
    async getAll(orderId: string): Promise<IComment[]> {
        return commentRepository.getAll(orderId);
    }
}
export const commentService = new CommentService();
