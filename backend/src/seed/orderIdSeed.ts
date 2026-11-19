// import { Order } from "../models/orderModel";
//
// export const seedOrderIds = async (): Promise<void> => {
//     const documentsWithoutId = await Order.find({
//         id: { $exists: false },
//     })
//         .sort({ _id: 1 })
//         .select("_id")
//         .lean();
//
//     if (!documentsWithoutId.length) return;
//
//     const lastDocument = await Order.findOne({
//         id: { $exists: true },
//     })
//         .sort({ id: -1 })
//         .select("id")
//         .lean();
//
//     let nextId = (lastDocument?.id ?? 0) + 1;
//
//     for (const document of documentsWithoutId) {
//         await Order.updateOne(
//             { _id: document._id },
//             { $set: { id: nextId++ } },
//         );
//     }
// };
//
// export const seedData = async () => {
//     await seedOrderIds();
//     await Order.createIndexes();
// };
import { Model, Types } from "mongoose";

import { Order } from "../models/orderModel";

interface ISeedDocument {
    _id: Types.ObjectId;
    id?: number;
}

export const seedDocumentIds = async <T extends ISeedDocument>(
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

    for (const { _id } of documentsWithoutId) {
        await model.updateOne({ _id }, { $set: { id: nextId++ } });
    }
};

export const seedData = async () => {
    await seedDocumentIds(Order);
    await Order.createIndexes();
};
