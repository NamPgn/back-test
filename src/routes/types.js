import express from "express";
import { CreateType, DeleteType, GetAllTypeCategorys, GetOneTypeCategory, PushCategory, UpdatedType } from "../controller/types";
import { isAdmin, isAuth, requiredSignin } from "../middlewares/checkAuth";
import { getAuth } from '../controller/auth';
const router = express.Router();

router.get('/types', GetAllTypeCategorys);
router.get('/type/:id', GetOneTypeCategory);
router.post('/type', requiredSignin, isAuth, isAdmin, CreateType);
router.post('/type/:id/:userId', requiredSignin, isAuth, isAdmin, DeleteType);
router.put('/type/:id', requiredSignin, isAuth, isAdmin, UpdatedType);
router.post('/push/type/category/:id', PushCategory)
router.param('userId', getAuth);
export default router