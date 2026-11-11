import { Router } from "express";

import { CommentValidator } from "../../../shared/validators/commentValidator";
import { OrderValidator } from "../../../shared/validators/orderValidator";
import { commentController } from "../controllers/commentController";
import { groupController } from "../controllers/groupController";
import { orderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

const router = Router();
router.get(
    "",
    validationMiddleware.validateQuery(OrderValidator.query),
    orderController.getAll,
);
router.get("/groups", groupController.getGroups);
router.post(
    "/groups",
    validationMiddleware.validateBody(OrderValidator.createGroup),
    groupController.create,
);
router.get(
    "/statistics",
    authMiddleware.hasPermission,
    orderController.getStatistics,
);
router.get(
    "/excel",
    validationMiddleware.validateQuery(OrderValidator.query),
    orderController.createExcel,
);
router.put(
    "/:orderId",
    validationMiddleware.isIdValidate("orderId"),
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
    validationMiddleware.validateBody(CommentValidator.comment),
    commentController.create,
);

export const orderRouter = router;
