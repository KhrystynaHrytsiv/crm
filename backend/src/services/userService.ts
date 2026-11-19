import { RoleEnum } from "../../../shared/enums/roleEnum";
import { ActionTokenType } from "../../../shared/enums/tokenEnum";
import { ActionType } from "../../../shared/interfaces/ActionType";
import { IManagerWithStatistics } from "../../../shared/interfaces/IManagerWithStatistics";
import { IResPagination } from "../../../shared/interfaces/IResPagination";
import { ManagerDTO } from "../../../shared/interfaces/IUser";
import { config } from "../configs/config";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";
import { IUserDoc } from "../models/userModel";
import {
    emptyStatistics,
    orderRepository,
} from "../repositories/orderRepository";
import { tokenRepository } from "../repositories/tokenRepository";
import { userRepository } from "../repositories/userRepository";
import { passwordService } from "./passwordService";
import { tokenService } from "./tokenService";

class UserService {
    async getById(id: string): Promise<IUserDoc> {
        const user = await userRepository.getById(id);
        if (!user) {
            throw new apiError("User not found", StatusCode.NOT_FOUND);
        }
        return user;
    }
    async createManager(dto: ManagerDTO): Promise<IUserDoc> {
        const existingUser = await userRepository.getByEmail(dto.email);
        if (existingUser) {
            throw new apiError(
                "User with this email already exists",
                StatusCode.CONFLICT,
            );
        }
        const id = await userRepository.generateNextId();
        return userRepository.create({ ...dto, id, role: RoleEnum.manager });
    }
    async getManagers(
        page: number,
    ): Promise<IResPagination<IManagerWithStatistics<IUserDoc>>> {
        const pageSize = 10;
        const [managers, totalItems] = await userRepository.getManagersPage(
            page,
            pageSize,
        );
        const totalPages = Math.ceil(totalItems / pageSize);
        const statisticsMap = await orderRepository.getManagersStatistics(
            managers.map((manager) => manager._id),
        );

        const data = managers.map((manager) => ({
            manager,
            statistics:
                statisticsMap.get(manager._id.toString()) ?? emptyStatistics(),
        }));

        return {
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
            data,
        };
    }
    async update(id: string, dto: Partial<IUserDoc>): Promise<IUserDoc> {
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
        if (action === "ban" && manager.is_banned) {
            throw new apiError(
                "Manager is already banned",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === "unban" && !manager.is_banned) {
            throw new apiError(
                "Manager is already unbanned",
                StatusCode.BAD_REQUEST,
            );
        }
        const updatedManager = await this.update(userId, {
            is_banned: action === "ban",
        });
        if (action === "ban") {
            await tokenRepository.deleteAllByUserId(userId);
        }
        return updatedManager;
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
        if (user.role !== RoleEnum.manager && user.role !== RoleEnum.admin) {
            throw new apiError(
                "Action is available only for admin and managers",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === ActionTokenType.activate && user.is_active) {
            throw new apiError(
                "Manager is already active",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === ActionTokenType.recovery && !user.is_active) {
            throw new apiError("Manager is not active", StatusCode.BAD_REQUEST);
        }
        const token = tokenService.generateActionToken(
            { userId: id, role: user.role },
            action,
        );
        return `${config.FRONTEND_URL}/${action}/${token}`;
    }
    async completeAction(
        token: string,
        password: string,
        action: ActionTokenType,
    ): Promise<IUserDoc> {
        const { userId, iat } = tokenService.verifyTokens(token, action);

        if (typeof iat !== "number") {
            throw new apiError("Invalid token", StatusCode.BAD_REQUEST);
        }

        const hashedPassword = await passwordService.hashPassword(password);
        const updated = await userRepository.completeAction(
            userId,
            action,
            iat,
            hashedPassword,
        );
        if (!updated) {
            throw new apiError(
                "Token is no longer valid or has already been used",
                StatusCode.BAD_REQUEST,
            );
        }
        if (action === ActionTokenType.recovery) {
            await tokenRepository.deleteAllByUserId(userId);
        }
        return updated;
    }
}
export const userService = new UserService();
