import {IOrder, OrderDTO} from "../interfaces/IOrder";
import {Order} from "../models/orderModel";
import {IQuery} from "../interfaces/IQuery";
import {QueryFilter} from "mongoose";
import {CourseStatusEnum} from "../enums/courseStatusEnum";

class OrderRepository {
    async getAll(query:IQuery):Promise<[IOrder[], number]>{
        query.pageSize = 25;
        const skip = query.pageSize * (query.page - 1);
        const filterObject: QueryFilter<IOrder> = { };
        if (query.status === "null" || query.status === CourseStatusEnum.new) {
            filterObject.$or = [
                { status: CourseStatusEnum.new },
                { status: null },
            ];
        } else if (query.status) {
            filterObject.status = query.status as CourseStatusEnum;
        }
        Object.entries(query).forEach(([key, value]) => {
            if (!value) return;
            if (key === "page" || key === "pageSize" || key === "order" || key === "start_date" || key === "end_date" || key === "status") {
                return;
            }
            if (key === "age") {
                filterObject[key] = Number(value);
                return;
            }
            filterObject[key] = {$regex: value, $options: "i"};
        });
        if (query.start_date || query.end_date) {
            filterObject.created_at = {};
            if (query.start_date) {
                filterObject.created_at.$gte = new Date(`${query.start_date}T00:00:00.000Z`);
            }
            if (query.end_date) {
                filterObject.created_at.$lte = new Date(`${query.end_date}T23:59:59.999Z`);
            }
        }
        return Promise.all([
            Order.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(query.order),
            Order.find(filterObject).countDocuments(),
        ]);

    }
    async getGroups():Promise<string[]>{
        return Order.distinct("group")
    }
    getById(id:string):Promise<IOrder | null>{
        return Order.findById(id);
    }
    // getByParams(params:Partial<IOrder>):Promise<IOrder[]>{
    //     return Order.find(params);
    // }
    update(id:string, dto:OrderDTO):Promise<IOrder | null>{
        return Order.findByIdAndUpdate(id, dto, {returnDocument: "after"});
    }

}
export const orderRepository = new OrderRepository();