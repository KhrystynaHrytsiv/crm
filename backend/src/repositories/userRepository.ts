import { IUser } from "../../../shared/interfaces/IUser";
import { User } from "../models/userModel";

class UserRepository {
    create(dto: Partial<IUser>): Promise<IUser> {
        return User.create(dto);
    }
    getById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }
    getByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }
    getByParams(params: Partial<IUser>): Promise<IUser[]> {
        return User.find(params).sort({ _id: -1 });
    }
    update(id: string, dto: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, dto, { returnDocument: "after" });
    }
    getManagersPage(
        page: number,
        pageSize: number,
    ): Promise<[IUser[], number]> {
        return Promise.all([
            User.find()
                .sort({ _id: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize),
            User.countDocuments(),
        ]);
    }
}
export const userRepository = new UserRepository();
