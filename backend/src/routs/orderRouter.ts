import {Router} from "express";
import {orderController} from "../controllers/orderController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {OrderValidator} from "../validators/orderValidator";

const router = Router();
router.get('', orderController.getAll);
router.get('/:id',validationMiddleware.isIdValidate("id"), orderController.getById);
router.put('/:id', validationMiddleware.isIdValidate("id"), validationMiddleware.validateBody(OrderValidator.update), orderController.update)
router.get('/groups', orderController.getGroups)

export const orderRouter = router;