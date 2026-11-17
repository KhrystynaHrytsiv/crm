import { ManagerRef } from "./IUser";

// Comment as it comes from the API (manager is always populated)
export interface IComment {
    _id: string;
    orderId: string;
    comment: string;
    manager: ManagerRef;
    created_at: string;
}
export type CommentDto = Pick<IComment, "comment">;
