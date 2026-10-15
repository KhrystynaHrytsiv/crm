import {NextFunction, Request, Response} from "express";
import {IQuery} from "../interfaces/IQuery";
import {orderService} from "../services/orderService";
import {StatusCode} from "../enums/StatusCode";
import {OrderDTO} from "../interfaces/IOrder";
import {TokenPayload} from "../interfaces/IToken";

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
    async getById (req: Request, res:Response, next:NextFunction){
        try {
            const id = req.params.id as string;
            const order = await orderService.getById(id);
            res.status(StatusCode.OK).json(order);
        }catch (e) {
            next(e);
        }
    }
    async update (req: Request, res:Response, next:NextFunction){
        try{
            const {userId} = res.locals.tokenPayload as TokenPayload;
            const orderId = req.params.orderId as string;
            const body = req.body as OrderDTO;
            const order = await orderService.update(orderId, body, userId);
            res.status(StatusCode.OK).json(order);
        }catch (e) {
            next(e);
        }
    }
    async getStatistics (req: Request, res:Response, next:NextFunction){
        try{
            const statistics  = await orderService.getStatistics();
            res.status(StatusCode.OK).json(statistics);
        }catch (e) {
            next(e);
        }
    }

}
export const orderController = new OrderController();