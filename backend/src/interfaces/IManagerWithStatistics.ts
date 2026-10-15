import {IUser} from "./IUser";
import {IStatistic} from "./IStatistic";

export interface IManagerWithStatistics {
    manager:IUser,
    statistics: IStatistic
}