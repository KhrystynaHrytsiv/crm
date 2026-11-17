import { CourseEnum, CourseFormat } from "../enums/CourseEnum";
import { CourseStatusEnum } from "../enums/courseStatusEnum";
import { CourseTypeEnum } from "../enums/courseTypeEnum";
import { ManagerRef } from "./IUser";

// Order as it comes from the API (manager is populated with surname)
export interface IOrder {
    _id: string;
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: CourseEnum;
    course_format: CourseFormat;
    course_type: CourseTypeEnum;
    status: CourseStatusEnum;
    sum: number;
    alreadyPaid: number;
    created_at: string;
    utm: string;
    msg: string;
    group: string;
    manager: ManagerRef | null;
}
export type OrderDTO = Pick<
    IOrder,
    | "name"
    | "surname"
    | "email"
    | "phone"
    | "age"
    | "status"
    | "sum"
    | "alreadyPaid"
    | "course"
    | "course_format"
    | "course_type"
    | "group"
>;
