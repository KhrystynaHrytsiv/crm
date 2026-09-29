import {IOrder, OrderDTO} from "../../../backend/src/interfaces/IOrder";
import {api} from "./apiService";

export const orderService = {
    async update (id:string, dto:OrderDTO) {
        const {data} = await api.patch<IOrder>(`/orders/${id}`, dto);
        return data;
    }
}