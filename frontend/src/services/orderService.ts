import { CommentDto } from "../../../shared/interfaces/IComment";
import { IOrder, OrderDTO } from "../../../shared/interfaces/IOrder";
import { CommentResponse } from "../interfaces/CommentResponse";
import { api } from "./apiService";

export const orderService = {
    async update(id: string, dto: Partial<OrderDTO>): Promise<IOrder> {
        const { data } = await api.put<IOrder>(`/orders/${id}`, dto);
        return data;
    },
    async getComments(orderId: string): Promise<CommentResponse[]> {
        const { data } = await api.get<CommentResponse[]>(
            `/orders/${orderId}/comments`,
        );
        return data;
    },
    async createComment(
        orderId: string,
        dto: CommentDto,
    ): Promise<CommentResponse> {
        const { data } = await api.post(`/orders/${orderId}/comments`, dto);
        return data;
    },
    async getExcelFile(params: URLSearchParams) {
        const response = await api.get("/orders/excel", {
            params,
            responseType: "blob",
        });
        return response.data;
    },
};
