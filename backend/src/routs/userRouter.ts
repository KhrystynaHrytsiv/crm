import {Router} from "express";
import {userController} from "../controllers/userController";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {ManagerValidator} from "../validators/managerValidator";
import {authMiddleware} from "../middleware/authMiddleware";
import {TokenEnum} from "../enums/tokenEnum";

const router = Router();
router.post('', authMiddleware.checkToken(TokenEnum.access),
    authMiddleware.hasPermission,
    validationMiddleware.validateBody(ManagerValidator.create),
    userController.createManager);

export const managerRouter = router;