import { NextFunction, Request, Response } from "express";

import { OrderDTO } from "../../../shared/interfaces/IOrder";
import { IQuery } from "../../../shared/interfaces/IQuery";
import { TokenPayload } from "../../../shared/interfaces/IToken";
import { StatusCode } from "../enums/StatusCode";
import { orderService } from "../services/orderService";

class OrderController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayload;
            const query = { ...req.query } as unknown as IQuery;
            const orders = await orderService.getAll(query, userId);
            res.status(StatusCode.OK).json(orders);
        } catch (e) {
            next(e);
        }
    }
    async getGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const groups = await orderService.getGroups();
            res.status(StatusCode.OK).json(groups);
        } catch (e) {
            next(e);
        }
    }
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayload;
            const orderId = req.params.orderId as string;
            const body = req.body as OrderDTO;
            const order = await orderService.update(orderId, body, userId);
            res.status(StatusCode.OK).json(order);
        } catch (e) {
            next(e);
        }
    }
    async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const statistics = await orderService.getStatistics();
            res.status(StatusCode.OK).json(statistics);
        } catch (e) {
            next(e);
        }
    }
    async createExcel(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayload;
            const buffer = await orderService.createExcelSheet(
                req.query as unknown as IQuery,
                userId,
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            res.setHeader(
                "Content-Disposition",
                'attachment; filename="orders.xlsx"',
            );
            res.send(Buffer.from(buffer));
        } catch (e) {
            next(e);
        }
    }
}
export const orderController = new OrderController();
