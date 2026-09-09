import {Router} from "express";
import {orderController} from "../controllers/orderController";

const router = Router();
router.get('', orderController.getAll);

export const orderRouter = router;