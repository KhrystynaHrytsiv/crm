import { ActionTokenType } from "../../../shared/enums/tokenEnum";
import { IUserDoc, User } from "../models/userModel";

class UserRepository {
    create(dto: Partial<IUserDoc>): Promise<IUserDoc> {
        return User.create(dto);
    }
    getById(id: string): Promise<IUserDoc | null> {
        return User.findById(id);
    }
    getByEmail(email: string): Promise<IUserDoc | null> {
        return User.findOne({
            email: { $regex: `^${email.trim()}$`, $options: "i" },
        });
    }
    update(id: string, dto: Partial<IUserDoc>): Promise<IUserDoc | null> {
        return User.findByIdAndUpdate(id, dto, { returnDocument: "after" });
    }
    getManagersPage(
        page: number,
        pageSize: number,
    ): Promise<[IUserDoc[], number]> {
        return Promise.all([
            User.find()
                .sort({ _id: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize),
            User.countDocuments(),
        ]);
    }
    async generateNextId(): Promise<number> {
        const lastDocument = await User.findOne({ id: { $exists: true } })
            .sort({ id: -1 })
            .select("id")
            .lean();
        return (lastDocument?.id ?? 0) + 1;
    }
    async completeAction(
        userId: string,
        action: ActionTokenType,
        tokenIssuedAt: number,
        password: string,
    ): Promise<IUserDoc | null> {
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
                returnDocument: "after",
                runValidators: true,
            },
        );
    }
}
export const userRepository = new UserRepository();
