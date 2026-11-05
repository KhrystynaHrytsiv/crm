import { IStatistics } from "./IStatistics";
import { IUser } from "./IUser";

export interface IManagerWithStatistics {
    manager: IUser;
    statistics: IStatistics;
}
