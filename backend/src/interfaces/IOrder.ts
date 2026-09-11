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
    group: string,
    created_at:Date,
    manager: string,
}