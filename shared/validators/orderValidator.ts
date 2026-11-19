import joi from "joi";

import { CourseEnum, CourseFormat } from "../enums/CourseEnum";
import { CourseStatusEnum } from "../enums/courseStatusEnum";
import { CourseTypeEnum } from "../enums/courseTypeEnum";
import { OrderSortEnum } from "../enums/OrderSortEnum";

export class OrderValidator {
    private static nameField = joi.string().max(20).trim().allow(null);
    private static surname = joi.string().max(35).trim().allow(null);
    private static email = joi.string().email().trim().allow(null);

    private static phone = joi
        .string()
        .pattern(/^(?:\+380|380|0)(\d{9})$/)
        .messages({
            "string.pattern.base":
                "Phone number must be in a valid Ukrainian format",
        })
        .allow(null);

    private static age = joi
        .number()
        .integer()
        .min(16)
        .max(90)
        .messages({ "number.base": "Age must be a number" })
        .allow(null);
    private static course = joi
        .string()
        .valid(...Object.values(CourseEnum))
        .empty("")
        .allow(null);

    private static course_format = joi
        .string()
        .valid(...Object.values(CourseFormat))
        .empty("")
        .allow(null);

    private static course_type = joi
        .string()
        .valid(...Object.values(CourseTypeEnum))
        .empty("")
        .allow(null);

    private static status = joi
        .string()
        .valid(...Object.values(CourseStatusEnum))
        .allow(null);

    private static sum = joi
        .number()
        .min(0)
        .max(10000000000)
        .messages({ "number.base": "Sum must be a number" })
        .allow(null);
    private static alreadyPaid = joi
        .number()
        .min(0)
        .max(10000000000)
        .messages({ "number.base": "Already paid must be a number" })
        .allow(null);
    private static group = joi.string().trim().min(1).allow(null);
    private static manager = joi.string().valid("true").optional();

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

    private static searchString = joi.string().trim().max(100).empty("");

    public static query = joi.object({
        page: joi.number().integer().min(1).default(1),
        name: this.searchString,
        surname: this.searchString,
        email: this.searchString,
        phone: this.searchString,
        age: this.age,
        manager: this.manager,
        course: this.course,
        course_format: this.course_format,
        course_type: this.course_type,
        group: this.searchString,
        status: joi
            .string()
            .valid(...Object.values(CourseStatusEnum))
            .empty(""),
        start_date: joi.string().isoDate(),
        end_date: joi.string().isoDate(),
        order: joi
            .string()
            .valid(
                ...Object.values(OrderSortEnum),
                ...Object.values(OrderSortEnum).map((item) => `-${item}`),
            ),
    });
    public static createGroup = joi.object({
        name: joi.string().trim().min(1).max(30).lowercase().required(),
    });
}
