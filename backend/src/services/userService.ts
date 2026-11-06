import { ActionType } from "../../../shared/interfaces/ActionType";
import { IManagerWithStatistics } from "../../../shared/interfaces/IManagerWithStatistics";
import { IResPagination } from "../../../shared/interfaces/IResPagination";
import { IStatistics } from "../../../shared/interfaces/IStatistics";
import { IUser, ManagerDTO } from "../../../shared/interfaces/IUser";
import { config } from "../configs/config";
import { CourseStatusEnum } from "../enums/courseStatusEnum";
import { RoleEnum } from "../enums/roleEnum";
import { StatusCode } from "../enums/StatusCode";
import { ActionTokenType } from "../enums/tokenEnum";
import { apiError } from "../error/apiError";
import { orderRepository } from "../repositories/orderRepository";
import { userRepository } from "../repositories/userRepository";
import { passwordService } from "./passwordService";
import { tokenService } from "./tokenService";

class UserService {
    async getById(id: string): Promise<IUser> {
        const user = await userRepository.getById(id);
        if (!user) {
            throw new apiError("User not found", StatusCode.NOT_FOUND);
        }
        return user;
    }
    async createManager(dto: ManagerDTO): Promise<IUser> {
        const existingUser = await userRepository.getByEmail(dto.email);
        if (existingUser) {
            throw new apiError(
                "User with this email already exists",
                StatusCode.CONFLICT,
            );
        }
        return userRepository.create({ ...dto, role: RoleEnum.manager });
    }
    async getManagers(
        page: number,
    ): Promise<IResPagination<IManagerWithStatistics>> {
        const pageSize = 10;
        const [managers, totalItems] = await userRepository.getManagersPage(
            page,
            pageSize,
        );
        const totalPages = Math.ceil(totalItems / pageSize);
        const statisticsMap = await orderRepository.getManagersStatistics(
            managers.map((manager) => manager._id),
        );

        const emptyStatistics = Object.values(CourseStatusEnum).reduce(
            (acc, status) => {
                acc[status] = 0;
                return acc;
            },
            { total: 0 } as IStatistics,
        );
        const data = managers.map((manager) => ({
            manager,
            statistics:
                statisticsMap.get(manager._id.toString()) ?? emptyStatistics,
        }));

        return {
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
            data,
        };
    }
    async update(id: string, dto: Partial<IUser>): Promise<IUser> {
        await userService.getById(id);
        const user = await userRepository.update(id, dto);
        if (!user) {
            throw new apiError("User not found", StatusCode.NOT_FOUND);
        }
        return user;
    }

    async changeStatus(userId: string, action: ActionType, currentId: string) {
        const manager = await this.getById(userId);
        if (
            manager.role === RoleEnum.admin &&
            action === "ban" &&
            userId === currentId
        ) {
            throw new apiError(
                "Admin cannot ban himself",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action !== "ban" && action !== "unban") {
            throw new apiError("Invalid status action", StatusCode.BAD_REQUEST);
        }
        if (action === "ban" && manager.is_Banned) {
            throw new apiError(
                "Manager is already banned",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === "unban" && !manager.is_Banned) {
            throw new apiError(
                "Manager is already unbanned",
                StatusCode.BAD_REQUEST,
            );
        }
        return this.update(manager._id, { is_Banned: action === "ban" });
    }

    async actionRequest(id: string, action: ActionTokenType) {
        if (
            action !== ActionTokenType.activate &&
            action !== ActionTokenType.recovery
        ) {
            throw new apiError(
                "Invalid type of action",
                StatusCode.BAD_REQUEST,
            );
        }
        const user = await this.getById(id);
        if (user.role !== RoleEnum.manager) {
            throw new apiError(
                "Action is available only for managers",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === ActionTokenType.activate && user.is_Active) {
            throw new apiError(
                "Manager is already active",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === ActionTokenType.recovery && !user.is_Active) {
            throw new apiError("Manager is not active", StatusCode.BAD_REQUEST);
        }
        const token = tokenService.generateActionToken(
            { userId: id, role: RoleEnum.manager },
            action,
        );
        return `${config.FRONTEND_URL}/${action}/${token}`;
    }
    async completeAction(
        token: string,
        password: string,
        action: ActionTokenType,
    ): Promise<IUser> {
        const { userId, iat } = tokenService.verifyTokens(token, action);
        const user = await this.getById(userId);
        if (action === ActionTokenType.activate && user.is_Active) {
            throw new apiError(
                "Manager is already active",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === ActionTokenType.recovery && !user.is_Active) {
            throw new apiError("Manager is not active", StatusCode.BAD_REQUEST);
        }
        if (
            user.passwordChangedAt &&
            iat! <= Math.floor(user.passwordChangedAt.getTime() / 1000)
        ) {
            throw new apiError(
                "Token is no longer valid",
                StatusCode.BAD_REQUEST,
            );
        }
        const hashedPassword = await passwordService.hashPassword(password);
        return await this.update(userId, {
            password: hashedPassword,
            passwordChangedAt: new Date(),
            ...(action === ActionTokenType.activate && { is_Active: true }),
        });
    }
}
export const userService = new UserService();
