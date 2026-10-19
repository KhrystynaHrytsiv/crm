import {ActionTokenType} from "../../../backend/src/enums/tokenEnum";
import {generalService} from "./generalService";
import {api} from "./apiService";
import {ActionType} from "../../../shared/interfaces/ActionType";
import {IUser} from "../../../shared/interfaces/IUser";
import {IUserDto} from "../interfaces/IUserDto";

export const managerService = {
    async actionRequest(id:string, action:ActionTokenType){
        return await generalService.get<string>(`/manager/${id}/${action}`)
    },
    async actionComplete (action:ActionTokenType, token:string, password:string){
        return await api.post<string>(`/manager/${action}/${token}`, {password})
    },
    async changeStatus (id:string, action:ActionType){
        return await api.patch(`/manager/${id}/${action}`)
    },
    async createManager (dto:IUserDto):Promise<IUser>{
        return await api.post('/manager', dto)
    }
}