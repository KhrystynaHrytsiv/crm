import {IUser} from "../interfaces/IUser";
import {userRepository} from "../repositories/userRepository";

class UserService {
    getAll():Promise<IUser[]>{
        return userRepository.getAll()
    }
}