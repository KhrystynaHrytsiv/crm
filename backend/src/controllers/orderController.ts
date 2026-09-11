import {NextFunction, Request, Response} from "express";
import {IQuery} from "../interfaces/IQuery";
import {orderService} from "../services/orderService";
import {StatusCode} from "../enums/StatusCode";

class OrderController {
    async getAll(req: Request, res:Response, next:NextFunction){
        try{
           const query = req.query as any as IQuery;
           const orders = await orderService.getAll(query);
           res.status(StatusCode.OK).json(orders);
        }catch (e) {
            next(e);
        }
    }
    async getGroups(req: Request, res:Response, next:NextFunction){
        try{
            const groups = await orderService.getGroups();
            res.status(StatusCode.OK).json(groups);
        }catch (e) {
            next(e);
        }
    }
}
export const orderController = new OrderController();