import { QueryFilter } from "mongoose";

import { IOrder, OrderDTO } from "../../../shared/interfaces/IOrder";
import { IQuery } from "../../../shared/interfaces/IQuery";
import { IStatistic } from "../../../shared/interfaces/IStatistic";
import { CourseStatusEnum } from "../enums/courseStatusEnum";
import { Order } from "../models/orderModel";

const searchFields = ["name", "surname", "email", "phone"] as const;
const exactFields = [
    "course",
    "course_format",
    "course_type",
    "group",
] as const;
const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class OrderRepository {
    async getAll(query: IQuery, userId: string): Promise<[IOrder[], number]> {
        const filterObject = this.filter(query, userId);
        const skip = query.pageSize * (query.page - 1);
        const sortOrder = query.order || "-id";
        return Promise.all([
            Order.find(filterObject)
                .populate("manager", "surname")
                .limit(query.pageSize)
                .skip(skip)
                .sort(sortOrder),
            Order.find(filterObject).countDocuments(),
        ]);
    }
    filter(query: IQuery, userId: string): QueryFilter<IOrder> {
        const filterObject: QueryFilter<IOrder> = {};
        if (query.status === "null" || query.status === CourseStatusEnum.new) {
            filterObject.$or = [
                { status: CourseStatusEnum.new },
                { status: null },
                { status: "" as CourseStatusEnum },
            ];
        } else if (query.status) {
            filterObject.status = query.status as CourseStatusEnum;
        }
        if (query.my === "true") {
            filterObject.manager = userId;
        }
        for (const key of searchFields) {
            const value = query[key];
            if (value) {
                filterObject[key] = {
                    $regex: escapeRegex(String(value)),
                    $options: "i",
                };
            }
        }
        for (const key of exactFields) {
            const value = query[key];
            if (value) {
                filterObject[key] = String(value);
            }
        }
        if (query.age) {
            filterObject.age = Number(query.age);
        }
        if (query.start_date || query.end_date) {
            filterObject.created_at = {};
            if (query.start_date) {
                filterObject.created_at.$gte = new Date(
                    `${query.start_date}T00:00:00.000Z`,
                );
            }
            if (query.end_date) {
                filterObject.created_at.$lte = new Date(
                    `${query.end_date}T23:59:59.999Z`,
                );
            }
        }
        return filterObject;
    }
    async getGroups(): Promise<string[]> {
        return Order.distinct("group");
    }
    getById(id: string): Promise<IOrder | null> {
        return Order.findById(id);
    }
    update(id: string, dto: Partial<OrderDTO>): Promise<IOrder | null> {
        return Order.findByIdAndUpdate(id, dto, { returnDocument: "after" });
    }
    async getStatistics(managerId?: string): Promise<IStatistic> {
        const filter = managerId ? { manager: managerId } : {};
        const statuses = Object.values(CourseStatusEnum);
        const statistics = await Promise.all(
            statuses.map(async (status) => ({
                [status]: await Order.countDocuments({ ...filter, status }),
            })),
        );
        const total = await Order.countDocuments(filter);
        const nullCount = await Order.countDocuments({
            ...filter,
            status: { $type: 10 },
        });
        return { total, ...Object.assign({}, ...statistics), null: nullCount };
    }
    async getDataForExcel(query: IQuery, userId: string): Promise<IOrder[]> {
        const filterObject = this.filter(query, userId);
        return Order.find(filterObject)
            .populate("manager", "surname")
            .sort(query.order || "-id");
    }
}
export const orderRepository = new OrderRepository();
