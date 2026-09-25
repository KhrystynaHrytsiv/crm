import {Router} from "express";
import {userController} from "../controllers/userController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {ManagerValidator} from "../validators/managerValidator";
import {authMiddleware} from "../middleware/authMiddleware";
import {PasswordValidator} from "../validators/passwordValidator";

const router = Router();
router.post('', authMiddleware.hasPermission,
    validationMiddleware.validateBody(ManagerValidator.create),
    userController.createManager);
router.get('', userController.getManagers);
router.patch('/:id/:action',authMiddleware.hasPermission, userController.changeStatus)
router.get("/:id/:action", validationMiddleware.isIdValidate("id"), userController.actionRequest)
router.post("/:action/:token", validationMiddleware.validateBody(PasswordValidator.passwordValid), userController.completeAction)
export const managerRouter = router;