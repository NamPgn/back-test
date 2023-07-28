import express from 'express';
import { createCartController, deleteCartController, getAllCartControllers } from '../controller/cart';
import { requiredSignin, isAuth, checkToken } from "../middlewares/checkAuth";
import { getAuth } from '../controller/auth';
const router = express.Router();


router.get('/cart', getAllCartControllers);
router.post('/cart/:userId', requiredSignin, isAuth, checkToken, createCartController);
router.post('/cart/:id:/:userId', requiredSignin, isAuth, checkToken, deleteCartController);
router.param('userId', getAuth);
export default router