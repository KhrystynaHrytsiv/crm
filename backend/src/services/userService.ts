import {IUser, ManagerDTO} from "../interfaces/IUser";
import {userRepository} from "../repositories/userRepository";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";
import {RoleEnum} from "../enums/roleEnum";
import {ActionType} from "../interfaces/ActionType";

class UserService {
    async getById(id:string):Promise<IUser>{
        const user = await userRepository.getById(id);
        if(!user){
            throw new apiError("User not found", StatusCode.NOT_FOUND)
        }
        return user;
    }
    async createManager(dto:ManagerDTO):Promise<IUser>{
        return userRepository.create({...dto, role: RoleEnum.manager});
    }
    async update (id:string, dto:Partial<IUser>):Promise<IUser>{
        await userService.getById(id);
        const user = await userRepository.update(id, dto);
        if(!user){
            throw new apiError("User not found", StatusCode.NOT_FOUND)
        }
        return user
    }
    async changeStatus (userId:string, action:ActionType){
        const user = await this.getById(userId);
        if (action === "ban"){
           if(!user.is_Active){
               throw new apiError("Manager is already banned", StatusCode.BAD_REQUEST)
           }
            return await this.update(userId, {is_Active: false});
        } if (action === "unban"){
            if(user.is_Active){
                throw new apiError("Manager is already unbanned", StatusCode.BAD_REQUEST)
            }
            return await this.update(userId, {is_Active: true})
        }
    }
}
export const userService = new UserService();