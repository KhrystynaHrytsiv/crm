import { IGroup } from "../../../shared/interfaces/IGroup";
import { Group } from "../models/groupModel";
import { Order } from "../models/orderModel";

class GroupRepository {
    async create(dto: IGroup): Promise<IGroup> {
        return Group.create(dto);
    }
    async getGroups(): Promise<string[]> {
        return Order.distinct("group");
    }
}
export const groupRepository = new GroupRepository();
