import { IGroup } from "../../../shared/interfaces/IGroup";
import { groupRepository } from "../repositories/groupRepository";

class GroupService {
    async getGroups(): Promise<string[]> {
        return await groupRepository.getGroups();
    }
    async create(dto: IGroup): Promise<IGroup> {
        return await groupRepository.create(dto);
    }
}
export const groupService = new GroupService();
