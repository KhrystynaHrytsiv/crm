import { NextFunction, Request, Response } from "express";

import { IGroup } from "../../../shared/interfaces/IGroup";
import { StatusCode } from "../enums/StatusCode";
import { groupService } from "../services/groupService";

class GroupController {
    async getGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const groups = await groupService.getGroups();
            res.status(StatusCode.OK).json(groups);
        } catch (e) {
            next(e);
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as IGroup;
            const group = await groupService.create(body);
            res.status(StatusCode.CREATED).json(group);
        } catch (e) {
            next(e);
        }
    }
}
export const groupController = new GroupController();
