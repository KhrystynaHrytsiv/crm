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
    update(id:string, dto:Partial<IUser>):Promise<IUser | null>{
        return User.findByIdAndUpdate(id, dto, {returnDocument: "after"})
    }
    getByParams(params:Partial<IUser>):Promise<IUser[]>{
        return User.find(params).sort({_id: -1});
    }

}
export const userRepository = new UserRepository();