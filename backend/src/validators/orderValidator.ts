import joi from "joi";
import {OrderSortEnum} from "../enums/OrderSortEnum";

export class OrderValidator {
    private static name= joi.string().max(20);
    private static surname= joi.string().max(35);
    private static email= joi.string().email();
    private static phone= joi.string().pattern(/^(?:\+380|380|0)(?:\d{9})$/);
    private static age= joi.number().min(16).max(90);
    private static course= joi.string();
    private static course_format= joi.string();
    private static course_type= joi.string();
    private static status= joi.string();
    private static sum= joi.number();
    private static alreadyPaid= joi.number();
    private static group= joi.string();

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