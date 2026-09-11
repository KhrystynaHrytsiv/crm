import {CourseEnum, CourseFormat} from "../../../backend/src/enums/CourseEnum";
import {CourseTypeEnum} from "../../../backend/src/enums/courseTypeEnum";
import {CourseStatusEnum} from "../../../backend/src/enums/courseStatusEnum";

export const filters = [
    {
        key: "course",
        label: "all courses",
        options: Object.values(CourseEnum),
    },
    {
        key: "format",
        label: "all formats",
        options: Object.values(CourseFormat),
    },
    {
        key: "type",
        label: "all types",
        options: Object.values(CourseTypeEnum),
    },
    {
        key: "status",
        label: "all statuses",
        options: Object.values(CourseStatusEnum),
    },
    {
        key: "group",
        label: "all groups",
        options: Object.values(CourseStatusEnum),
    }
];
export const inputs = [
    {
        key: "name",
        label: "Name"
    },
    {
        key: "surname",
        label: "Surname"
    },
    {
        key: "email",
        label: "Email"
    },
    {
        key: "phone",
        label: "Phone"
    },
    {
        key: "age",
        label: "Age"
    }
]