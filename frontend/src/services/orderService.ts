import { CommentDto, IComment } from "../../../shared/interfaces/IComment";
import { IOrder, OrderDTO } from "../../../shared/interfaces/IOrder";
import { generalService } from "./generalService";

export const orderService = {
    async update(id: string, dto: Partial<OrderDTO>): Promise<IOrder> {
        return await generalService.patch<IOrder, Partial<OrderDTO>>(
            `/orders/${id}`,
            dto,
        );
    },
    async getComments(orderId: string): Promise<IComment[]> {
        return await generalService.get<IComment[]>(
            `/orders/${orderId}/comments`,
        );
    },
    async createComment(
        orderId: string,
        dto: CommentDto,
    ): Promise<IComment> {
        return await generalService.post<IComment, CommentDto>(
            `/orders/${orderId}/comments`,
            dto,
        );
    },
    async getExcelFile(params: URLSearchParams) {
        return await generalService.get<Blob>("/orders/excel", {
            params,
            responseType: "blob",
        });
    },
};
