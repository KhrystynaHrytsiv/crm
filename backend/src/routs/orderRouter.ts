import { Router } from "express";

import { CommentValidator } from "../../../shared/validators/commentValidator";
import { OrderValidator } from "../../../shared/validators/orderValidator";
import { commentController } from "../controllers/commentController";
import { orderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

const router = Router();
router.get("", orderController.getAll);
router.get("/groups", orderController.getGroups);
router.get("/statistics", orderController.getStatistics);
router.get("/excel", orderController.createExcel);
router.put(
    "/:orderId",
    validationMiddleware.isIdValidate("orderId"),
    authMiddleware.canModify,
    validationMiddleware.validateBody(OrderValidator.update),
    orderController.update,
);
router.get(
    "/:orderId/comments",
    validationMiddleware.isIdValidate("orderId"),
    commentController.getAll,
);
router.post(
    "/:orderId/comments",
    validationMiddleware.isIdValidate("orderId"),
    authMiddleware.canModify,
    validationMiddleware.validateBody(CommentValidator.comment),
    commentController.create,
);

export const orderRouter = router;
