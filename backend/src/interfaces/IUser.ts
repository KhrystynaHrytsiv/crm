import {RoleEnum} from "../enums/roleEnum";

export interface IUser {
    _id:string,
    email:string,
    password:string,
    role: RoleEnum,
    is_Active: boolean,
    name:string,
    surname:string,
    last_login:Date | null
}

export type ManagerDTO = Pick<IUser, "name" | "surname" | "email">;