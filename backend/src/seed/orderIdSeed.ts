import { Model } from "mongoose";

import { Order } from "../models/orderModel";
import { User } from "../models/userModel";

interface IHasId {
    _id: string;
    id?: number;
}

export const seedIds = async <T extends IHasId>(
    model: Model<T>,
): Promise<void> => {
    const documentsWithoutId = await model
        .find({ id: { $exists: false } })
        .sort({ _id: 1 })
        .select("_id")
        .lean();

    if (!documentsWithoutId.length) return;

    const lastDocument = await model
        .findOne({ id: { $exists: true } })
        .sort({ id: -1 })
        .select("id")
        .lean();

    let nextId = (lastDocument?.id ?? 0) + 1;

    for (const document of documentsWithoutId) {
        await model.updateOne(
            { _id: document._id },
            { $set: { id: nextId++ } },
        );
    }
};
export const seedData = async () => {
    await seedIds(Order);
    await Order.createIndexes();
    await createManagerId();
};
export const createManagerId = async () => {
    await seedIds(User);
    await User.createIndexes();
};
