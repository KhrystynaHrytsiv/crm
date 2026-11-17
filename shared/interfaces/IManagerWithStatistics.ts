import { IStatistics } from "./IStatistics";
import { IUser } from "./IUser";

// U lets the backend use its own user document type before serialization
export interface IManagerWithStatistics<U = IUser> {
    manager: U;
    statistics: IStatistics;
}
