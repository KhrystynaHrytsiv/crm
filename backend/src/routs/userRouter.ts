import {Router} from "express";
import {userController} from "../controllers/userController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {ManagerValidator} from "../../../shared/validators/managerValidator";
import {authMiddleware} from "../middleware/authMiddleware";
import {PasswordValidator} from "../../../shared/validators/passwordValidator";
import {TokenEnum} from "../enums/tokenEnum";

const router = Router();
router.post('', authMiddleware.checkToken(TokenEnum.access),
    authMiddleware.hasPermission,
    validationMiddleware.validateBody(ManagerValidator.create),
    userController.createManager);
router.get('', authMiddleware.checkToken(TokenEnum.access), authMiddleware.hasPermission, userController.getManagers);
router.patch('/:id/:action', authMiddleware.checkToken(TokenEnum.access) ,authMiddleware.hasPermission, userController.changeStatus)
router.get("/:id/:action", authMiddleware.checkToken(TokenEnum.access), authMiddleware.hasPermission, validationMiddleware.isIdValidate("id"), userController.actionRequest)
router.post("/:action/:token", validationMiddleware.validateBody(PasswordValidator.passwordValid), userController.completeAction)
export const managerRouter = router;