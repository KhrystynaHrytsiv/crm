import {IUser} from "../interfaces/IUser";
import {User} from "../models/userModel";

class UserRepository {
    getAll():Promise<IUser[]>{
        return User.find()
    }
    create(dto:Partial<IUser>):Promise<IUser>{
        return User.create(dto)
    }
}
export const userRepository = new UserRepository();