import {IOrder, OrderDTO} from "../../../backend/src/interfaces/IOrder";
import {api} from "./apiService";
import {CommentDto, IComment} from "../../../backend/src/interfaces/IComment";

export const orderService = {
    async update (id:string, dto:OrderDTO):Promise<IOrder> {
        const {data} = await api.put<IOrder>(`/orders/${id}`, dto);
        return data;
    },
    async createComment (orderId:string, dto:CommentDto):Promise<IComment>{
       const {data} = await api.post(`/orders/${orderId}`, dto);
       return data;
    }
}