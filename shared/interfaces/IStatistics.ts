import { CourseStatusEnum } from "../enums/courseStatusEnum";

export type IStatistics = {
    total: number;
} & Record<CourseStatusEnum, number>;
