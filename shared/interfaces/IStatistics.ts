import { CourseStatusEnum } from "../../backend/src/enums/courseStatusEnum";

export type IStatistics = {
    total: number;
} & Record<CourseStatusEnum, number>;
