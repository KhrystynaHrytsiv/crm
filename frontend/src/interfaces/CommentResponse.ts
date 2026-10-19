import {IComment} from "../../../shared/interfaces/IComment";

export interface CommentResponse extends Omit<IComment, "manager">{
    manager: {
        _id:string,
        surname:string
    }
}