import {CourseEnum, CourseFormat} from "../enums/CourseEnum";
import {CourseStatusEnum} from "../enums/courseStatusEnum";
import {CourseTypeEnum} from "../enums/courseTypeEnum";

export interface IOrder {
    _id:string;
    name:string;
    surname:string;
    email:string;
    phone:string;
    age:number;
    course:CourseEnum,
    course_format:CourseFormat,
    course_type:CourseTypeEnum,
    status:CourseStatusEnum,
    sum:number,
    alreadyPaid:number,
    created_at:Date,
    utm:string,
    msg:string,
    group: string,
    manager: string,
}
export type OrderDTO = Pick<IOrder, "name" | "surname" | "email" | "phone" | "age" | "status" | "sum" | "alreadyPaid" | "course" | "course_format" | "course_type" | "group">
