import {IOrder, OrderDTO} from "../../../backend/src/interfaces/IOrder";
import {api} from "./apiService";
import {CommentDto} from "../../../backend/src/interfaces/IComment";
import {CommentResponse} from "../interfaces/CommentResponse";

export const orderService = {
    async update (id:string, dto:Partial<OrderDTO>):Promise<IOrder> {
        const {data} = await api.put<IOrder>(`/orders/${id}`, dto);
        return data;
    },
    async createComment (orderId:string, dto:CommentDto):Promise<CommentResponse>{
       const {data} = await api.post(`/orders/${orderId}/comments`, dto);
       return data;
    }
}