import { IStatistic } from "./IStatistic";
import { IUser } from "./IUser";

export interface IManagerWithStatistics {
    manager: IUser;
    statistics: IStatistic;
}
