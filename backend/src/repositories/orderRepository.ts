import {IOrder} from "../interfaces/IOrder";
import {Order} from "../models/orderModel";
import {IQuery} from "../interfaces/IQuery";
import {QueryFilter} from "mongoose";

class OrderRepository {
    getAll(query:IQuery):Promise<[IOrder[], number]>{
        query.pageSize = 25;
        const skip = query.pageSize * (query.page - 1);
        const filterObject: QueryFilter<IOrder> = { };
        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" } ;
        }
        if (query.surname){
            filterObject.surname = { $regex: query.surname, $options: "i" } ;
        }
        if (query.email){
            filterObject.surname = { $regex: query.email, $options: "i" } ;
        }
        if (query.phone){
            filterObject.phone = query.phone;
        }
        if(query.age){
            filterObject.age = Number(query.age);
        }
        return Promise.all([
            Order.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(query.order),
            Order.find(filterObject).countDocuments(),
        ]);
    }

}
export const orderRepository = new OrderRepository();