import { QueryFilter } from "mongoose";

import { IOrder, OrderDTO } from "../../../shared/interfaces/IOrder";
import { IQuery } from "../../../shared/interfaces/IQuery";
import { IStatistics } from "../../../shared/interfaces/IStatistics";
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
        const filterObject = await this.filter(query, userId);
        const skip = query.pageSize * (query.page - 1);
        let sortOrder = query.order || "-id";
        return Promise.all([
            Order.find(filterObject)
                .populate("manager", "surname")
                .limit(query.pageSize)
                .skip(skip)
                .sort(sortOrder),
            Order.find(filterObject).countDocuments(),
        ]);
    }
    async filter(query: IQuery, userId: string): Promise<QueryFilter<IOrder>> {
        const filterObject: QueryFilter<IOrder> = {};
        if (query.status === "null" || query.status === CourseStatusEnum.new) {
            filterObject.$or = [
                { status: CourseStatusEnum.new },
                { status: null },
            ];
        } else if (query.status) {
            filterObject.status = query.status as CourseStatusEnum;
        }
        if (query.manager) {
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
        return Order.findByIdAndUpdate(id, dto, {
            returnDocument: "after",
        }).populate("manager", "surname");
    }
    private getStatisticsGroup(groupByManager: boolean) {
        const statuses = Object.values(CourseStatusEnum);
        const statusCounts = Object.fromEntries(
            statuses
                .filter((status) => status !== CourseStatusEnum.new)
                .map((status) => [
                    status,
                    {
                        $sum: {
                            $cond: [{ $eq: ["$status", status] }, 1, 0],
                        },
                    },
                ]),
        );

        return {
            _id: groupByManager ? "$manager" : null,
            total: { $sum: 1 },
            [CourseStatusEnum.new]: {
                $sum: {
                    $cond: [
                        {
                            $or: [
                                { $eq: ["$status", CourseStatusEnum.new] },
                                { $eq: [{ $type: "$status" }, "null"] },
                            ],
                        },
                        1,
                        0,
                    ],
                },
            },

            ...statusCounts,
        };
    }
    async getStatistics(): Promise<IStatistics> {
        const [statistics] = await Order.aggregate([
            {
                $group: this.getStatisticsGroup(false),
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    ...Object.fromEntries(
                        Object.values(CourseStatusEnum).map((status) => [
                            status,
                            1,
                        ]),
                    ),
                },
            },
        ]);

        return statistics;
    }
    async getManagersStatistics(
        managerIds: string[],
    ): Promise<Map<string, IStatistics>> {
        const statistics = await Order.aggregate([
            {
                $match: {
                    manager: { $in: managerIds },
                },
            },
            {
                $group: this.getStatisticsGroup(true),
            },
        ]);

        return new Map(statistics.map((item) => [item._id.toString(), item]));
    }
    async getDataForExcel(query: IQuery, userId: string): Promise<IOrder[]> {
        const filterObject = await this.filter(query, userId);
        return Order.find(filterObject)
            .populate("manager", "surname")
            .sort(query.order || "-id");
    }
}
export const orderRepository = new OrderRepository();
