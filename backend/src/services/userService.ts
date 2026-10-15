import {IUser, ManagerDTO} from "../interfaces/IUser";
import {userRepository} from "../repositories/userRepository";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";
import {RoleEnum} from "../enums/roleEnum";
import {ActionType} from "../interfaces/ActionType";
import {ActionTokenType} from "../enums/tokenEnum";
import {tokenService} from "./tokenService";
import {config} from "../configs/config";
import {passwordService} from "./passwordService";
import {orderRepository} from "../repositories/orderRepository";
import {IManagerWithStatistics} from "../interfaces/IManagerWithStatistics";

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
    async getManagers():Promise<IManagerWithStatistics[]>  {
        const managers = await userRepository.getByParams({role: RoleEnum.manager});
       return await Promise.all(
            managers.map(async (manager) => ({
                manager,
                statistics: await orderRepository.getStatistics(manager._id.toString())
            }))
       )
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
    async actionRequest (id:string, action:ActionTokenType) {
        if (action !== ActionTokenType.activate && action !== ActionTokenType.recovery){
            throw new apiError("Invalid type of action", StatusCode.BAD_REQUEST)
        }
        const user = await this.getById(id);
        if(action === ActionTokenType.activate && user.is_Active){
            throw new apiError("Manager is already active", StatusCode.BAD_REQUEST)
        }
        if (action === ActionTokenType.recovery && !user.is_Active){
            throw new apiError("Manager is not active", StatusCode.BAD_REQUEST)
        }
        const token = tokenService.generateActionToken({userId: id, role: RoleEnum.manager}, action);
        return `${config.FRONTEND_URL}/${action}/${token}`;

    }
    async completeAction(token:string, password:string, action:ActionTokenType):Promise<IUser>{
        const {userId} = tokenService.verifyTokens(token, action);
        const user = await this.getById(userId);
        if (action === ActionTokenType.activate && user.is_Active) {
            throw new apiError("Manager is already active", StatusCode.BAD_REQUEST);
        }
        if (action === ActionTokenType.recovery && !user.is_Active){
            throw new apiError("Manager is not active", StatusCode.BAD_REQUEST)
        }
        const hashedPassword = await passwordService.hashPassword(password);
        return await this.update(userId, {password: hashedPassword,
            ...(action === ActionTokenType.activate && {is_Active: true})});
    }


}
export const userService = new UserService();