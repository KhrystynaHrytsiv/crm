import {Request, Response, NextFunction} from "express";
import {CommentDto} from "../interfaces/IComment";
import {commentService} from "../services/commentService";
import {StatusCode} from "../enums/StatusCode";
import {TokenPayload} from "../interfaces/IToken";

class CommentController {
    async create (req: Request, res:Response, next:NextFunction){
        try{
            console.log(res.locals.tokenPayload, "!!!!!!!!!!");
            const {userId} = res.locals.tokenPayload as TokenPayload;
            const orderId = req.params.orderId as string;
            const body = req.body as CommentDto;
            const comment = await commentService.create(body, orderId, userId);
            res.status(StatusCode.CREATED).json(comment)
        }catch (e) {
            next(e);
        }
    }
    async getAll (req: Request, res:Response, next:NextFunction){
        try{
            const orderId = req.params.orderId as string;
            const comments = await commentService.getAll(orderId);
            res.status(StatusCode.OK).json(comments)
        }catch (e) {
            next(e);
        }
    }
}
export const commentController = new CommentController();