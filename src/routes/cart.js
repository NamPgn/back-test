import express from 'express';
import { createCartController, deleteCartController, getAllCartControllers } from '../controller/cart';

const router = express.Router();


router.get('/cart', getAllCartControllers);
router.post('/cart', createCartController);
router.post('/cart/:id', deleteCartController)
export default router