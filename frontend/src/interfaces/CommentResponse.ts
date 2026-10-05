import {IComment} from "../../../backend/src/interfaces/IComment";

export interface CommentResponse extends Omit<IComment, "manager">{
    manager: {
        _id:string,
        surname:string
    }
}