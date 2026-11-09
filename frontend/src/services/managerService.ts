import { ActionTokenType } from "../../../backend/src/enums/tokenEnum";
import { ActionType } from "../../../shared/interfaces/ActionType";
import { IUser } from "../../../shared/interfaces/IUser";
import { IUserDto } from "../interfaces/IUserDto";
import { generalService } from "./generalService";

export const managerService = {
    async actionRequest(id: string, action: ActionTokenType) {
        return await generalService.get<string>(`/manager/${id}/${action}`);
    },
    async verifyActionToken(action: ActionTokenType, token: string) {
        return await generalService.get<{ isValid: boolean }>(
            `/manager/isValidToken/${action}/${token}`,
        );
    },
    async actionComplete(
        action: ActionTokenType,
        token: string,
        password: string,
    ) {
        return await generalService.post<string, { password: string }>(
            `/manager/${action}/${token}`,
            {
                password,
            },
        );
    },
    async changeStatus(id: string, action: ActionType) {
        return await generalService.patch(`/manager/${id}/${action}`);
    },
    async createManager(dto: IUserDto): Promise<IUser> {
        return await generalService.post<IUser, IUserDto>("/manager", dto);
    },
};
