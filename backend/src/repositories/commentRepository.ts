import {
    Comment,
    ICommentDoc,
    ICommentPopulated,
} from "../models/commentModel";
import { ManagerRefDoc } from "../models/userModel";

class CommentRepository {
    async create(dto: Omit<ICommentDoc, "_id">): Promise<ICommentPopulated> {
        const comment = await Comment.create(dto);
        return comment.populate<{ manager: ManagerRefDoc }>(
            "manager",
            "surname",
        );
    }
    getAll(orderId: string): Promise<ICommentPopulated[]> {
        return Comment.find({ orderId }).populate<{ manager: ManagerRefDoc }>(
            "manager",
            "surname",
        );
    }
}
export const commentRepository = new CommentRepository();
