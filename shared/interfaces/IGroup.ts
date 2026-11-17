export interface IGroup {
    _id: string;
    name: string;
}
export type GroupDTO = Pick<IGroup, "name">;
