import {IUser} from "../interfaces/IUser";
import {userRepository} from "../repositories/userRepository";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";

class UserService {
    async getById(id:string):Promise<IUser>{
        const user = await userRepository.getById(id);
        if(!user){
            throw new apiError("User not found", StatusCode.NOT_FOUND)
        }
        return user;
    }
};
export const userService = new UserService();