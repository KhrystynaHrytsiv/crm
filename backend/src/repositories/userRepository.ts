import {IUser} from "../interfaces/IUser";
import {User} from "../models/userModel";

class UserRepository {
    create(dto:Partial<IUser>):Promise<IUser>{
        return User.create(dto);
    };
    getById(id:string):Promise<IUser | null>{
        return User.findById(id);
    }
    getByEmail(email:string):Promise<IUser | null>{
        return User.findOne({email});
    }
}
export const userRepository = new UserRepository();