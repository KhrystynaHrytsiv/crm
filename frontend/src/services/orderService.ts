import { CommentDto } from "../../../shared/interfaces/IComment";
import { IOrder, OrderDTO } from "../../../shared/interfaces/IOrder";
import { CommentResponse } from "../interfaces/CommentResponse";
import { generalService } from "./generalService";

export const orderService = {
    async update(id: string, dto: Partial<OrderDTO>): Promise<IOrder> {
        return await generalService.put<IOrder, Partial<OrderDTO>>(
            `/orders/${id}`,
            dto,
        );
    },
    async getComments(orderId: string): Promise<CommentResponse[]> {
        return await generalService.get<CommentResponse[]>(
            `/orders/${orderId}/comments`,
        );
    },
    async createComment(
        orderId: string,
        dto: CommentDto,
    ): Promise<CommentResponse> {
        return await generalService.post<CommentResponse, CommentDto>(
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
