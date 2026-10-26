import {
    CourseEnum,
    CourseFormat,
} from "../../../backend/src/enums/CourseEnum";
import { CourseStatusEnum } from "../../../backend/src/enums/courseStatusEnum";
import { CourseTypeEnum } from "../../../backend/src/enums/courseTypeEnum";
import { OrderDTO } from "../../../shared/interfaces/IOrder";

export const filters = (groups: string[]) => [
    {
        key: "course",
        placeholder: "all courses",
        label: "Course",
        options: Object.values(CourseEnum),
    },
    {
        key: "course_format",
        placeholder: "all formats",
        label: "Course format",
        options: Object.values(CourseFormat),
    },
    {
        key: "course_type",
        placeholder: "all types",
        label: "Course type",
        options: Object.values(CourseTypeEnum),
    },
    {
        key: "status",
        placeholder: "all statuses",
        label: "Status",
        options: Object.values(CourseStatusEnum),
    },
    {
        key: "group",
        placeholder: "all groups",
        label: "Group",
        options: groups,
    },
];
export const inputs = [
    {
        key: "name",
        label: "Name",
        type: "string",
    },
    {
        key: "surname",
        label: "Surname",
        type: "string",
    },
    {
        key: "email",
        label: "Email",
        type: "email",
    },
    {
        key: "phone",
        label: "Phone",
        type: "number",
    },
    {
        key: "age",
        label: "Age",
        type: "number",
    },
];
export const extendedInputs = [
    ...inputs,
    {
        key: "sum",
        label: "Sum",
        type: "number",
    },
    {
        key: "alreadyPaid",
        label: "Already paid",
        type: "number",
    },
];
export const fieldOrder: (keyof OrderDTO)[] = [
    "group",
    "status",
    "name",
    "sum",
    "surname",
    "alreadyPaid",
    "email",
    "course",
    "phone",
    "course_format",
    "age",
    "course_type",
];
export type Filter = ReturnType<typeof filters>;
