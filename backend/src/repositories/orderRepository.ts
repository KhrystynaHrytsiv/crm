import { fromZonedTime } from "date-fns-tz";
import { PipelineStage, QueryFilter, Types } from "mongoose";

import { CourseStatusEnum } from "../../../shared/enums/courseStatusEnum";
import { OrderDTO } from "../../../shared/interfaces/IOrder";
import { IQuery } from "../../../shared/interfaces/IQuery";
import { IStatistics } from "../../../shared/interfaces/IStatistics";
import { IOrderDoc, IOrderPopulated, Order } from "../models/orderModel";
import { ManagerRefDoc } from "../models/userModel";

const searchFields = ["name", "surname", "email", "phone"] as const;
const exactFields = [
    "course",
    "course_format",
    "course_type",
    "group",
] as const;
const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const freeStatuses = [null, CourseStatusEnum.new];
const isFreeStatus = {
    $in: [{ $ifNull: ["$status", null] }, freeStatuses],
};

const parseSort = (order?: string): { field: string; direction: 1 | -1 } => {
    const value = order || "-id";
    return value.startsWith("-")
        ? { field: value.slice(1), direction: -1 }
        : { field: value, direction: 1 };
};

class OrderRepository {
    async getAll(
        query: IQuery,
        userId: string,
    ): Promise<[IOrderPopulated[], number]> {
        const filterObject = this.filter(query, userId);
        const skip = query.pageSize * (query.page - 1);
        return Promise.all([
            this.findSorted(filterObject, query.order, skip, query.pageSize),
            Order.countDocuments(filterObject),
        ]);
    }

    filter(query: IQuery, userId: string): QueryFilter<IOrderDoc> {
        const filterObject: QueryFilter<IOrderDoc> = {};
        if (query.status === CourseStatusEnum.new) {
            filterObject.status = { $in: freeStatuses };
        } else if (query.status) {
            filterObject.status = query.status as CourseStatusEnum;
        }
        if (String(query.manager) === "true") {
            filterObject.manager = new Types.ObjectId(userId);
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
                filterObject.created_at.$gte = getDateBoundary(
                    query.start_date,
                );
            }
            if (query.end_date) {
                filterObject.created_at.$lte = getDateBoundary(
                    query.end_date,
                    true,
                );
            }
        }
        return filterObject;
    }

    private async findSorted(
        filterObject: QueryFilter<IOrderDoc>,
        order?: string,
        skip = 0,
        limit?: number,
    ): Promise<IOrderPopulated[]> {
        const { field, direction } = parseSort(order);
        const sort: Record<string, 1 | -1> =
            field === "id"
                ? { id: direction }
                : { [field]: direction, _id: -1 };

        if (field !== "manager") {
            const find = Order.find(filterObject)
                .populate<{ manager: ManagerRefDoc | null }>(
                    "manager",
                    "surname",
                )
                .sort(sort)
                .skip(skip);
            return (limit ? find.limit(limit) : find).lean<IOrderPopulated[]>();
        }

        const pipeline: PipelineStage[] = [
            { $match: filterObject },
            {
                $lookup: {
                    from: "users",
                    localField: "manager",
                    foreignField: "_id",
                    pipeline: [{ $project: { surname: 1 } }],
                    as: "manager",
                },
            },
            { $set: { manager: { $ifNull: [{ $first: "$manager" }, null] } } },
            { $sort: { "manager.surname": direction, _id: -1 } },
            { $skip: skip },
            ...(limit ? [{ $limit: limit }] : []),
        ];
        return Order.aggregate<IOrderPopulated>(pipeline).collation({
            locale: "en",
            strength: 2,
        });
    }

    async update(
        id: string,
        userId: string,
        dto: Partial<OrderDTO>,
    ): Promise<IOrderPopulated | null> {
        const { status, ...fields } = dto;
        const updateFields = {
            ...fields,
            ...(status !== undefined && {
                status,
                manager:
                    status === CourseStatusEnum.new
                        ? null
                        : new Types.ObjectId(userId),
            }),
        };

        return Order.findOneAndUpdate(
            this.editableBy(id, userId),
            { $set: updateFields },
            { returnDocument: "after" },
        ).populate<{ manager: ManagerRefDoc | null }>("manager", "surname");
    }

    async chooseOrder(
        orderId: string,
        userId: string,
    ): Promise<IOrderDoc | null> {
        return Order.findOneAndUpdate(
            this.editableBy(orderId, userId),
            [
                {
                    $set: {
                        manager: new Types.ObjectId(userId),
                        status: {
                            $cond: [
                                isFreeStatus,
                                CourseStatusEnum.inWork,
                                "$status",
                            ],
                        },
                    },
                },
            ],
            { returnDocument: "after", updatePipeline: true },
        );
    }

    private editableBy(
        orderId: string,
        userId: string,
    ): QueryFilter<IOrderDoc> {
        return {
            _id: new Types.ObjectId(orderId),
            manager: {
                $in: [null, new Types.ObjectId(userId)],
            },
        };
    }

    private getStatisticsGroup(groupByManager: boolean) {
        const statusCounts = Object.fromEntries(
            Object.values(CourseStatusEnum)
                .filter((status) => status !== CourseStatusEnum.new)
                .map((status) => [
                    status,
                    { $sum: { $cond: [{ $eq: ["$status", status] }, 1, 0] } },
                ]),
        );
        return {
            _id: groupByManager ? "$manager" : null,
            total: { $sum: 1 },
            [CourseStatusEnum.new]: { $sum: { $cond: [isFreeStatus, 1, 0] } },
            ...statusCounts,
        };
    }

    private statisticsProjection(keepId: boolean) {
        return {
            _id: keepId ? 1 : 0,
            total: 1,
            ...Object.fromEntries(
                Object.values(CourseStatusEnum).map((status) => [status, 1]),
            ),
        };
    }

    async getStatistics(): Promise<IStatistics> {
        const [statistics] = await Order.aggregate([
            { $group: this.getStatisticsGroup(false) },
            { $project: this.statisticsProjection(false) },
        ]);
        return statistics ?? emptyStatistics();
    }

    async getManagersStatistics(
        managerIds: Types.ObjectId[],
    ): Promise<Map<string, IStatistics>> {
        const statistics = await Order.aggregate([
            { $match: { manager: { $in: managerIds } } },
            { $group: this.getStatisticsGroup(true) },
            { $project: this.statisticsProjection(true) },
        ]);
        return new Map(
            statistics.map(({ _id, ...item }) => [_id.toString(), item]),
        );
    }

    async getDataForExcel(
        query: IQuery,
        userId: string,
    ): Promise<IOrderPopulated[]> {
        return this.findSorted(this.filter(query, userId), query.order);
    }
}

const getDateBoundary = (date: string, isEndOfDay = false): Date => {
    const time = isEndOfDay ? "23:59:59.999" : "00:00:00.000";
    return fromZonedTime(`${date}T${time}`, "Europe/Kyiv");
};
export const emptyStatistics = (): IStatistics =>
    Object.values(CourseStatusEnum).reduce(
        (acc, status) => ({ ...acc, [status]: 0 }),
        { total: 0 } as IStatistics,
    );

export const orderRepository = new OrderRepository();
