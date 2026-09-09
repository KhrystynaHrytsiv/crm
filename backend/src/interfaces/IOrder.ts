import {CourseEnum, CourseFormat} from "../enums/CourseEnum";
import {CourseStatusEnum} from "../enums/courseStatusEnum";

export interface IOrder {
    id:string;
    name:string;
    surname:string;
    email:string;
    phone:string;
    age:number;
    course:CourseEnum,
    format:CourseFormat,
    status:CourseStatusEnum,
    sum:number,
    alreadyPaid:number,
    group: string,
    manager: string,
}