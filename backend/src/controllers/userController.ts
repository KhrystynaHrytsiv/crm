import {NextFunction, Request, Response} from "express";
import {ManagerDTO} from "../interfaces/IUser";
import {userService} from "../services/userService";
import {StatusCode} from "../enums/StatusCode";
import {ActionType} from "../interfaces/ActionType";
import {ActionTokenType} from "../enums/tokenEnum";

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
    async getManagers (req: Request, res:Response, next: NextFunction){
        try {
            const managers = await userService.getManagers();
            res.status(StatusCode.OK).json(managers);
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
    async actionRequest(req:Request, res:Response, next:NextFunction){
        try{
            const {id, action} = req.params as {id:string; action:ActionTokenType};
            console.log(id, action);
            const url = await userService.actionRequest(id, action);
            res.status(StatusCode.OK).json(url);
        }catch (e) {
            next(e);
        }
    }
    async completeAction(req:Request, res:Response, next:NextFunction){
        try{
            const {token, action} = req.params as {token:string; action:ActionTokenType};
            const {password} = req.body;
            const user = await userService.completeAction(token, password, action);
            res.status(StatusCode.OK).json(user)
        }catch (e) {
            next(e);
        }
    }
}
export const userController = new UserController();