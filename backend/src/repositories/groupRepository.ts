import { GroupDTO } from "../../../shared/interfaces/IGroup";
import { Group, IGroupDoc } from "../models/groupModel";

class GroupRepository {
    async getGroups(): Promise<IGroupDoc[]> {
        return Group.find().sort({ name: 1 });
    }
    async create(dto: GroupDTO): Promise<IGroupDoc> {
        return Group.create(dto);
    }
    async findByName(name: string): Promise<IGroupDoc | null> {
        return Group.findOne({ name });
    }
}
export const groupRepository = new GroupRepository();
