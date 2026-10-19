import {IOrder, OrderDTO} from "../../../shared/interfaces/IOrder";
import {Order} from "../models/orderModel";
import {IQuery} from "../../../shared/interfaces/IQuery";
import {QueryFilter} from "mongoose";
import {CourseStatusEnum} from "../enums/courseStatusEnum";
import {userRepository} from "./userRepository";
import {IStatistic} from "../../../shared/interfaces/IStatistic";

class OrderRepository {
    async getAll(query:IQuery):Promise<[IOrder[], number]>{
        query.pageSize = 25;
        const filterObject = await this.filter(query);
        const skip = query.pageSize * (query.page - 1);
        const sortOrder = query.order || "-created_at";
        return Promise.all([
            Order.find(filterObject)
                .populate("manager", "surname")
                .limit(query.pageSize)
                .skip(skip)
                .sort(sortOrder),
            Order.find(filterObject).countDocuments(),
        ]);

    }
    async filter(query: IQuery): Promise<QueryFilter<IOrder>>{
        const filterObject: QueryFilter<IOrder> = { };
        if (query.status === "null" || query.status === CourseStatusEnum.new) {
            filterObject.$or = [{ status: CourseStatusEnum.new }, { status: null }];
        } else if (query.status) {
            filterObject.status = query.status as CourseStatusEnum;
        }
        if (query.manager) {
            const managers = await userRepository.getByParams({surname: query.manager});
            filterObject.manager = {$in: managers.map(manager => manager._id)};
        }
        Object.entries(query).forEach(([key, value]) => {
            if (!value) return;
            if (key === "page" || key === "pageSize" || key === "order" || key === "start_date" || key === "end_date" || key === "status" || key === "manager") {
                return;
            }
            if (key === "age") {
                filterObject[key] = Number(value); return;
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
        return filterObject;
    }
    async getGroups():Promise<string[]>{
        return Order.distinct("group")
    }
    getById(id:string):Promise<IOrder | null>{
        return Order.findById(id);
    }
    update(id:string, dto:Partial<OrderDTO>):Promise<IOrder | null>{
        return Order.findByIdAndUpdate(id, dto, {returnDocument: "after"});
    }
    async getStatistics(managerId?: string):Promise<IStatistic> {
        const filter = managerId ? { manager: managerId } : {};
        const statuses = Object.values(CourseStatusEnum);
        const statistics = await Promise.all(
            statuses.map(async (status) => ({
                [status]: await Order.countDocuments({ ...filter, status }),
            }))
        );
        const total = await Order.countDocuments(filter);
        const nullCount = await Order.countDocuments({...filter, status: { $type: 10 }});
        return {total, ...Object.assign({}, ...statistics), null: nullCount};
    }
    async getDataForExcel(query: IQuery): Promise<IOrder[]>{
        const filterObject = await this.filter(query);
        return Order.find(filterObject).populate("manager", "surname").sort({created_at: -1})
    }
}
export const orderRepository = new OrderRepository();