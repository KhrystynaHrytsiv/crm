import { RoleEnum } from "../enums/roleEnum";

export interface IUser {
    _id: string;
    id?: number;
    name: string;
    surname: string;
    email: string;
    role: RoleEnum;
    is_active: boolean;
    is_banned: boolean;
    last_login: string | null;
}

export type ManagerDTO = Pick<IUser, "name" | "surname" | "email">;

export type ManagerRef = Pick<IUser, "_id" | "surname">;
