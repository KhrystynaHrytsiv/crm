import joi from "joi";

import { CourseEnum, CourseFormat } from "../../backend/src/enums/CourseEnum";
import { CourseStatusEnum } from "../../backend/src/enums/courseStatusEnum";
import { CourseTypeEnum } from "../../backend/src/enums/courseTypeEnum";
import { OrderSortEnum } from "../../backend/src/enums/OrderSortEnum";

const nullableString = joi.string().empty("").allow(null);
const nullableNumber = joi.number().empty("").allow(null);

export class OrderValidator {
    private static nameField = nullableString.max(20);
    private static surname = nullableString.max(35);
    private static email = nullableString.email();

    private static phone = joi
        .string()
        .pattern(/^(?:\+380|380|0)(\d{9})$/)
        .empty("")
        .allow(null)
        .messages({
            "string.pattern.base":
                "Phone number must be in a valid Ukrainian format",
        });

    private static age = nullableNumber.min(16).max(90);
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

    private static sum = nullableNumber.min(1).max(10000000000);
    private static alreadyPaid = nullableNumber.min(1).max(10000000000);
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
    public static createGroup = joi.object({
        name: joi.string().trim().min(1).max(30).lowercase().required(),
    });
}
