import { RoleEnum } from "../enums/roleEnum";

export interface IUser {
    _id: string;
    id?: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    passwordChangedAt: Date | null;
    role: RoleEnum;
    is_active: boolean;
    is_banned: boolean;
    last_login: Date | null;
}

export type ManagerDTO = Pick<IUser, "name" | "surname" | "email">;
