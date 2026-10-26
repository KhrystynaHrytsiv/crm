import { Router } from "express";

import { ManagerValidator } from "../../../shared/validators/managerValidator";
import { PasswordValidator } from "../../../shared/validators/passwordValidator";
import { userController } from "../controllers/userController";
import { TokenEnum } from "../enums/tokenEnum";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

const router = Router();
router.post(
    "",
    authMiddleware.checkToken(TokenEnum.access),
    authMiddleware.hasPermission,
    validationMiddleware.validateBody(ManagerValidator.create),
    userController.createManager,
);
router.get(
    "",
    authMiddleware.checkToken(TokenEnum.access),
    authMiddleware.hasPermission,
    userController.getManagers,
);
router.patch(
    "/:id/:action",
    authMiddleware.checkToken(TokenEnum.access),
    authMiddleware.hasPermission,
    userController.changeStatus,
);
router.get(
    "/:id/:action",
    authMiddleware.checkToken(TokenEnum.access),
    authMiddleware.hasPermission,
    validationMiddleware.isIdValidate("id"),
    userController.actionRequest,
);
router.post(
    "/:action/:token",
    validationMiddleware.validateBody(PasswordValidator.passwordValid),
    userController.completeAction,
);
export const managerRouter = router;
