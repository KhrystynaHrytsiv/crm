import {CourseEnum, CourseFormat} from "../enums/CourseEnum";
import {CourseStatusEnum} from "../enums/courseStatusEnum";

export interface ICourse {
    id:string,
    course:CourseEnum,
    format:CourseFormat,
    status:CourseStatusEnum,
    sum:number,
    alreadyPaid:boolean,
    userId:string
}