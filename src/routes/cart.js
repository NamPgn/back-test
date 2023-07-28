import express from 'express';
import { createCartController, deleteCartController, getAllCartControllers } from '../controller/cart';
import { requiredSignin, isAuth, checkToken } from "../middlewares/checkAuth";
const router = express.Router();


router.get('/cart', getAllCartControllers);
router.post('/cart', requiredSignin, isAuth, checkToken, createCartController);
router.post('/cart/:id', requiredSignin, isAuth, checkToken, deleteCartController)
export default router