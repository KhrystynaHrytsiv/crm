import {IOrder} from "../interfaces/IOrder";
import {IQuery} from "../interfaces/IQuery";
import {IResPagination} from "../interfaces/IResPagination";
import {orderRepository} from "../repositories/orderRepository";

class OrderService {
    async getAll(query:IQuery):Promise<IResPagination<IOrder>>{
        const [data, totalItems] = await orderRepository.getAll(query);
        const totalPages = Math.ceil(totalItems/query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page < totalPages,
            data,
        };
    }
}
export const orderService = new OrderService();