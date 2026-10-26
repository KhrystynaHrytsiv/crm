import { IUser } from "../../../shared/interfaces/IUser";
import { RoleEnum } from "../enums/roleEnum";
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
    update(id: string, dto: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, dto, { returnDocument: "after" });
    }
    getManagersPage(
        page: number,
        pageSize: number,
    ): Promise<[IUser[], number]> {
        const filter = { role: RoleEnum.manager };
        return Promise.all([
            User.find(filter)
                .sort({ _id: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize),
            User.countDocuments(filter),
        ]);
    }
}
export const userRepository = new UserRepository();
