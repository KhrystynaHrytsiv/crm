import joi from "joi";
import {OrderSortEnum} from "../enums/OrderSortEnum";

export class OrderValidator {
    private static name= joi.string().max(20).allow(null);
    private static surname= joi.string().max(35).allow(null);
    private static email= joi.string().email().allow(null);
    private static phone= joi.string().pattern(/^(?:\+380|380|0)(?:\d{9})$/).allow(null);
    private static age= joi.number().min(16).max(90).allow(null);
    private static course= joi.string().allow(null);
    private static course_format= joi.string().allow(null);
    private static course_type= joi.string().allow(null);
    private static status= joi.string().allow(null);
    private static sum= joi.number().allow(null);
    private static alreadyPaid= joi.number().allow(null);
    private static group= joi.string().allow(null);

    public static update = joi.object({
        name: this.name,
        surname: this.surname,
        email: this.email,
        phone: this.phone,
        age: this.age,
        course: this.course,
        course_format: this.course_format,
        course_type: this.course_type,
        status: this.status,
        sum: this.sum,
        alreadyPaid: this.alreadyPaid,
        group: this.group,
    });

    public static query = joi.object({
        pageSize: joi.number().min(1).max(100).default(25),
        page: joi.number().min(1).default(1),
        name: this.name,
        surname: this.surname,
        email: this.email,
        phone: this.phone,
        age: this.age,
        order: joi
            .string()
            .valid(
                ...Object.values(OrderSortEnum),
                ...Object.values(OrderSortEnum).map((item) => `-${item}`),
            ),
    });
}