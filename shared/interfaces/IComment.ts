export interface IComment {
    _id?: string;
    orderId: string;
    comment: string;
    manager: string;
    created_At: Date;
}
export type CommentDto = Pick<IComment, "comment">;
