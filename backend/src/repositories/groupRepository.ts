import { GroupDTO, IGroup } from "../../../shared/interfaces/IGroup";
import { Group } from "../models/groupModel";

class GroupRepository {
    async getGroups(): Promise<IGroup[]> {
        return Group.find().sort({ name: 1 });
    }
    async create(dto: GroupDTO): Promise<IGroup> {
        return Group.create(dto);
    }
    async findByName(name: string): Promise<IGroup | null> {
        return Group.findOne({ name });
    }
}
export const groupRepository = new GroupRepository();
