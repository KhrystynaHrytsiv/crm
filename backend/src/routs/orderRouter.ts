import {Router} from "express";
import {orderController} from "../controllers/orderController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {OrderValidator} from "../validators/orderValidator";
import {commentController} from "../controllers/commentController";
import {CommentValidator} from "../validators/commentValidator";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();
router.get('',  orderController.getAll);
router.get('/groups', orderController.getGroups);
router.get('/statistics', orderController.getStatistics)
router.get('/:id',validationMiddleware.isIdValidate("id"), orderController.getById);
router.put('/:orderId',
    validationMiddleware.isIdValidate("orderId"),
    authMiddleware.canModify,
    validationMiddleware.validateBody(OrderValidator.update),
    orderController.update);
router.get('/:orderId/comments', validationMiddleware.isIdValidate("orderId"), commentController.getAll)
router.post('/:orderId/comments',
    validationMiddleware.isIdValidate("orderId"),
    authMiddleware.canModify,
    validationMiddleware.validateBody(CommentValidator.comment),
    commentController.create)

export const orderRouter = router;