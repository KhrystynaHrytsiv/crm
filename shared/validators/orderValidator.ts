import joi from "joi";

import { CourseEnum, CourseFormat } from "../../backend/src/enums/CourseEnum";
import { CourseStatusEnum } from "../../backend/src/enums/courseStatusEnum";
import { CourseTypeEnum } from "../../backend/src/enums/courseTypeEnum";
import { OrderSortEnum } from "../../backend/src/enums/OrderSortEnum";

export class OrderValidator {
    private static nameField = joi.string().max(20).allow(null, "");
    private static surname = joi.string().max(35).allow(null, "");
    private static email = joi.string().email().allow(null, "");
    private static phone = joi
        .string()
        .pattern(/^(?:\+380|380|0)(\d{9})$/)
        .allow(null, "");
    private static age = joi.number().min(16).max(90).allow(null, "");
    private static course = joi
        .string()
        .valid(...Object.values(CourseEnum))
        .allow(null, "");
    private static course_format = joi
        .string()
        .valid(...Object.values(CourseFormat))
        .allow(null, "");
    private static course_type = joi
        .string()
        .valid(...Object.values(CourseTypeEnum))
        .allow(null, "");
    private static status = joi
        .string()
        .valid(...Object.values(CourseStatusEnum))
        .allow(null, "");
    private static sum = joi.number().allow(null, "");
    private static alreadyPaid = joi.number().allow(null, "");
    private static group = joi.string().allow(null, "");
    private static manager = joi.string().allow(null, "");

    public static update = joi.object({
        name: this.nameField,
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
        newGroup: joi.any().strip(),
    });

    public static query = joi.object({
        pageSize: joi.number().min(1).max(100).default(25),
        page: joi.number().min(1).default(1),
        name: this.nameField,
        surname: this.surname,
        email: this.email,
        phone: this.phone,
        age: this.age,
        manager: this.manager,
        course: this.course,
        course_format: this.course_format,
        course_type: this.course_type,
        group: this.group,
        status: this.status,
        start_date: joi.date().iso(),
        end_date: joi.date().iso(),
        order: joi
            .string()
            .valid(
                ...Object.values(OrderSortEnum),
                ...Object.values(OrderSortEnum).map((item) => `-${item}`),
            ),
    });
}
