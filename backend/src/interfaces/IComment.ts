export interface IComment{
    orderId:string,
    comment:string,
    manager:string,
    created_At:Date
}
export type CommentDto= Pick<IComment, "comment">
