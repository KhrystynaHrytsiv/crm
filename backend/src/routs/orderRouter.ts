import {Router} from "express";
import {orderController} from "../controllers/orderController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {OrderValidator} from "../validators/orderValidator";
import {authMiddleware} from "../middleware/authMiddleware";
import {TokenEnum} from "../enums/tokenEnum";

const router = Router();
router.get('', authMiddleware.checkToken(TokenEnum.access), orderController.getAll);
router.get('/groups', orderController.getGroups);
router.get('/:id',validationMiddleware.isIdValidate("id"), orderController.getById);
router.put('/:id', validationMiddleware.isIdValidate("id"), validationMiddleware.validateBody(OrderValidator.update), orderController.update)

export const orderRouter = router;