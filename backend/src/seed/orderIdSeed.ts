import { Order } from "../models/orderModel";

export const seedOrderIds = async () => {
    const ordersWithoutId = await Order.find({ id: { $exists: false } })
        .sort({ _id: 1 })
        .select("_id")
        .lean();
    if (!ordersWithoutId.length) {
        return;
    }
    const lastOrder = await Order.findOne({ id: { $exists: true } })
        .sort({ id: -1 })
        .select("id")
        .lean();
    let nextId = (lastOrder?.id ?? 0) + 1;
    await Order.bulkWrite(
        ordersWithoutId.map((order) => ({
            updateOne: {
                filter: { _id: order._id },
                update: { $set: { id: nextId++ } },
            },
        })),
    );
    await Order.syncIndexes();
};
