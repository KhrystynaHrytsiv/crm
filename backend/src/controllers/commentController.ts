import { NextFunction, Request, Response } from "express";

import { CommentDto } from "../../../shared/interfaces/IComment";
import { TokenPayload } from "../../../shared/interfaces/IToken";
import { StatusCode } from "../enums/StatusCode";
import { commentService } from "../services/commentService";

class CommentController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayload;
            const orderId = req.params.orderId as string;
            const body = req.body as CommentDto;
            const comment = await commentService.create(body, orderId, userId);
            res.status(StatusCode.CREATED).json(comment);
        } catch (e) {
            next(e);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.orderId as string;
            const comments = await commentService.getAll(orderId);
            res.status(StatusCode.OK).json(comments);
        } catch (e) {
            next(e);
        }
    }
}
export const commentController = new CommentController();
