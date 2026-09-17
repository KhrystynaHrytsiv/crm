import {IUser, ManagerDTO} from "../interfaces/IUser";
import {userRepository} from "../repositories/userRepository";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";
import {RoleEnum} from "../enums/roleEnum";

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
};
export const userService = new UserService();