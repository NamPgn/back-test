import express from "express";
import { getAuth } from "../controller/auth";
import { addCt, deleteCategoryController, getAll, getAllCategoryNotReq, getOne, push, readProductByCategory, updateCate } from "../controller/category";
import { checkToken, isAdmin, isAuth, requiredSignin } from "../middlewares/checkAuth";
import { uploadCategory } from "../services/upload";
const router = express.Router();


router.get('/category/products', readProductByCategory);
router.get('/categorys', getAll);
router.get('/category/:id', getOne);
router.post('/category/:userId', requiredSignin, isAuth, isAdmin, checkToken, uploadCategory.single('file'), addCt);
router.put('/category/:id', requiredSignin, isAuth, isAdmin, checkToken, uploadCategory.single('file'), updateCate);
router.delete('/category/:id/:userId', requiredSignin, isAuth, isAdmin, deleteCategoryController)
router.get('/category/getAllCategoryNotRequest/:id', getAllCategoryNotReq);
router.post('/category/week/:id', requiredSignin, isAuth, isAdmin, push);
router.param('userId', getAuth);
export default router