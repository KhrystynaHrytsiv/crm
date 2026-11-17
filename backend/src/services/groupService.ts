import { GroupDTO } from "../../../shared/interfaces/IGroup";
import { StatusCode } from "../enums/StatusCode";
import { apiError } from "../error/apiError";
import { IGroupDoc } from "../models/groupModel";
import { groupRepository } from "../repositories/groupRepository";

class GroupService {
    async getGroups(): Promise<IGroupDoc[]> {
        return await groupRepository.getGroups();
    }
    async create(dto: GroupDTO): Promise<IGroupDoc> {
        const group = await groupRepository.findByName(dto.name);
        if (group) {
            throw new apiError("Group has already exists", StatusCode.CONFLICT);
        }
        return await groupRepository.create(dto);
    }
}
export const groupService = new GroupService();
