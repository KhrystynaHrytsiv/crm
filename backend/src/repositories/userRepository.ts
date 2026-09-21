import {IUser} from "../interfaces/IUser";
import {User} from "../models/userModel";

class UserRepository {
    create(dto:Partial<IUser>):Promise<IUser>{
        return User.create(dto);
    };
    getAll():Promise<IUser[]>{
        return User.find();
    }
    getById(id:string):Promise<IUser | null>{
        return User.findById(id);
    }
    getByEmail(email:string):Promise<IUser | null>{
        return User.findOne({email});
    }
    update(id:string, dto:Partial<IUser>):Promise<IUser | null>{
        return User.findByIdAndUpdate(id, dto, {returnDocument: "after"})
    }
}
export const userRepository = new UserRepository();