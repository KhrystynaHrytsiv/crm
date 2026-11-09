export interface IGroup {
    id: string;
    name: string;
}
export type GroupDTO = Pick<IGroup, "name">;
