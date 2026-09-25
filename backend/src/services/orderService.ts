import {IQuery} from "../interfaces/IQuery";
import {orderRepository} from "../repositories/orderRepository";
import {IOrder, OrderDTO} from "../interfaces/IOrder";
import {IResPagination} from "../interfaces/IResPagination";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";

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
    async getGroups():Promise<string[]>{
        return await orderRepository.getGroups();
    }
    async getById(id:string):Promise<IOrder>{
        const order = await orderRepository.getById(id);
        if(!order){
            throw new apiError("Order not found", StatusCode.NOT_FOUND)
        }
        return order;
    }
    async update(id: string, dto: OrderDTO): Promise<IOrder> {
        await this.getById(id);
        const order = await orderRepository.update(id, dto);
        if (!order) {
            throw new apiError("Order not found", StatusCode.NOT_FOUND);
        }
        return order;
    }
}
export const orderService = new OrderService();