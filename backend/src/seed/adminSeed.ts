import {userRepository} from "../repositories/userRepository";
import {RoleEnum} from "../enums/roleEnum";
import {passwordService} from "../services/passwordService";

export const seed = async () => {
    const existingAdmin = await userRepository.getByEmail("admin@gmail.com");
    if (existingAdmin) {
        return;
    }
    const hashPassword = await passwordService.hashPassword("admin");
    await userRepository.create({
        email: "admin@gmail.com",
        password: hashPassword,
        name: 'admin',
        surname: "admin",
        role: RoleEnum.admin,
        is_Active: true,
    });
};
