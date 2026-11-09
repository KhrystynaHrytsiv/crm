import { IGroup } from "../../../shared/interfaces/IGroup";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";
import { groupRepository } from "../repositories/groupRepository";

class GroupService {
    async getGroups(): Promise<IGroup[]> {
        return await groupRepository.getGroups();
    }
    async create(dto: IGroup): Promise<IGroup> {
        const group = await groupRepository.findByName(dto.name);
        if (group) {
            throw new apiError("Group has already exists", StatusCode.CONFLICT);
        }
        return await groupRepository.create(dto);
    }
}
export const groupService = new GroupService();
