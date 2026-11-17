import { Types } from "mongoose";

import { CommentDto } from "../../../shared/interfaces/IComment";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";
import { ICommentPopulated } from "../models/commentModel";
import { commentRepository } from "../repositories/commentRepository";
import { orderRepository } from "../repositories/orderRepository";

class CommentService {
    async create(
        dto: CommentDto,
        orderId: string,
        userId: string,
    ): Promise<ICommentPopulated> {
        const order = await orderRepository.chooseOrder(orderId, userId);
        if (!order) {
            throw new apiError(
                "Order is already assigned to another manager or cannot be modified",
                StatusCode.FORBIDDEN,
            );
        }
        return commentRepository.create({
            ...dto,
            orderId: new Types.ObjectId(orderId),
            manager: new Types.ObjectId(userId),
            created_at: new Date(),
        });
    }
    async getAll(orderId: string): Promise<ICommentPopulated[]> {
        return commentRepository.getAll(orderId);
    }
}
export const commentService = new CommentService();
