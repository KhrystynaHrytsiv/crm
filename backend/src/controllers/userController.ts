import {NextFunction, Request, Response} from "express";
import {ManagerDTO} from "../interfaces/IUser";
import {userService} from "../services/userService";
import {StatusCode} from "../enums/StatusCode";
import {ActionType} from "../interfaces/ActionType";

class UserController{
    async createManager (req: Request, res:Response, next: NextFunction){
        try {
          const body = req.body as ManagerDTO;
          const user = await userService.createManager(body);
          res.status(StatusCode.CREATED).json(user);
        }catch (e) {
            next(e);
        }
    }
    async changeStatus(req:Request, res:Response, next:NextFunction) {
        try{
            const {id, action} = req.params as {id:string; action:ActionType};
            const user = await userService.changeStatus(id, action);
            res.status(StatusCode.OK).json(user)
        }catch (e) {
            next(e);
        }
    }
}
export const userController = new UserController();