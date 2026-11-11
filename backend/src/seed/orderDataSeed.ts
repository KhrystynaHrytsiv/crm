import { CourseStatusEnum } from "../../../shared/enums/courseStatusEnum";
import { logger } from "../../../shared/logger";
import { Group } from "../models/groupModel";
import { Order } from "../models/orderModel";

const statuses = Object.values(CourseStatusEnum) as string[];

const normalizeStatus = (value: string): string | null => {
    const status = value.trim().toLowerCase();
    return statuses.includes(status) ? status : null;
};

const normalizeGroup = (value: string): string | null =>
    value
        .trim()
        .replace(/^["']+|["']+$/g, "")
        .trim()
        .toLowerCase() || null;

const normalizeOrders = async () => {
    const rawStatuses: unknown[] = await Order.distinct("status");
    for (const value of rawStatuses) {
        if (typeof value !== "string" || statuses.includes(value)) continue;
        const status = normalizeStatus(value);
        const { modifiedCount } = await Order.collection.updateMany(
            { status: value },
            { $set: { status } },
        );
        logger.info(
            { from: value, to: status, modifiedCount },
            "order status normalized",
        );
    }

    const rawGroups: unknown[] = await Order.distinct("group");
    for (const value of rawGroups) {
        if (typeof value !== "string") continue;
        const group = normalizeGroup(value);
        if (group === value) continue;
        const { modifiedCount } = await Order.collection.updateMany(
            { group: value },
            { $set: { group } },
        );
        logger.info(
            { from: value, to: group, modifiedCount },
            "order group normalized",
        );
    }
};

const seedGroups = async () => {
    const orderGroups = (await Order.distinct("group")).filter(
        (group): group is string => typeof group === "string" && !!group,
    );
    if (!orderGroups.length) return;
    await Group.bulkWrite(
        orderGroups.map((name) => ({
            updateOne: {
                filter: { name },
                update: { $setOnInsert: { name } },
                upsert: true,
            },
        })),
    );
};

export const seedOrderData = async () => {
    await normalizeOrders();
    await seedGroups();
};
