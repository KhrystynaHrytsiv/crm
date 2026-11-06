import { RoleEnum } from "../../backend/src/enums/roleEnum";

export interface IUser {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    passwordChangedAt: Date;
    role: RoleEnum;
    is_Active: boolean;
    is_Banned: boolean;
    last_login: Date | null;
}

export type ManagerDTO = Pick<IUser, "name" | "surname" | "email">;
