import {Router} from "express";
import {orderController} from "../controllers/orderController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {OrderValidator} from "../validators/orderValidator";
import {commentController} from "../controllers/commentController";

const router = Router();
router.get('',  orderController.getAll);
router.get('/groups', orderController.getGroups);
router.get('/:id',validationMiddleware.isIdValidate("id"), orderController.getById);
router.put('/:id', validationMiddleware.isIdValidate("id"), validationMiddleware.validateBody(OrderValidator.update), orderController.update);
router.get('/:orderId/comments', validationMiddleware.isIdValidate("orderId"), commentController.getAll)
router.post('/:orderId', validationMiddleware.isIdValidate("orderId"), commentController.create)

export const orderRouter = router;