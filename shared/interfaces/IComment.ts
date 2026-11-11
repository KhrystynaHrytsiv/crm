export interface IComment {
    _id?: string;
    orderId: string;
    comment: string;
    manager: string;
    created_at: Date;
}
export type CommentDto = Pick<IComment, "comment">;
