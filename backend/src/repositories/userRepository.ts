import { ActionTokenType } from "../../../shared/enums/tokenEnum";
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
    async completeAction(
        userId: string,
        action: ActionTokenType,
        tokenIssuedAt: number,
        password: string,
    ): Promise<IUser | null> {
        return User.findOneAndUpdate(
            {
                _id: userId,
                is_active: action !== ActionTokenType.activate,
                $or: [
                    { passwordChangedAt: null },
                    {
                        passwordChangedAt: {
                            $lt: new Date(tokenIssuedAt * 1000),
                        },
                    },
                ],
            },
            {
                $set: {
                    password,
                    passwordChangedAt: new Date(),
                    ...(action === ActionTokenType.activate && {
                        is_active: true,
                    }),
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );
    }
}
export const userRepository = new UserRepository();
