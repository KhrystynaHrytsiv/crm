import {Router} from "express";
import {orderController} from "../controllers/orderController";

const router = Router();
router.get('', orderController.getAll);
router.get('/groups', orderController.getGroups)

export const orderRouter = router;