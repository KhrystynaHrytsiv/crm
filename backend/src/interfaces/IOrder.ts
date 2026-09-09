import {CourseEnum, CourseFormat} from "../enums/CourseEnum";
import {CourseStatusEnum} from "../enums/courseStatusEnum";
import {CourseTypeEnum} from "../enums/courseTypeEnum";

export interface IOrder {
    id:string;
    name:string;
    surname:string;
    email:string;
    phone:string;
    age:number;
    course:CourseEnum,
    format:CourseFormat,
    type:CourseTypeEnum,
    status:CourseStatusEnum,
    sum:number,
    alreadyPaid:number,
    group: string,
    manager: string,
}