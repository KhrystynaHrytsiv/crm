import { IOrder } from "../interfaces/IOrder";

export const columns: {
    header:string;
    key: keyof IOrder;
    width: number;
}[] = [
    { header: "_id", key: "_id", width: 20 },
    { header: "name", key: "name", width: 15 },
    { header: "surname", key: "surname", width: 15 },
    { header: "email", key: "email", width: 25 },
    { header: "phone", key: "phone", width: 18 },
    { header: "age", key: "age", width: 10 },
    { header: "course", key: "course", width: 12 },
    { header: "course_format", key: "course_format", width: 18 },
    { header: "course_type", key: "course_type", width: 15 },
    { header: "sum", key: "sum", width: 10 },
    { header: "alreadyPaid", key: "alreadyPaid", width: 17 },
    { header: "status", key: "status", width: 12 },
    { header: "group", key: "group", width: 12 },
    { header: "created_at", key: "created_at", width: 25 },
    { header: "manager", key: "manager", width: 15 },
];