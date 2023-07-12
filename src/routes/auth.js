import express from "express";
import { edit, getAlluser, remove, signup, singin, getAuth, commented,findCartByUser, getone } from "../controller/auth";
import { upload, uploadXlxs, uploadStorageUser } from "../services/upload";

const router = express.Router();

router.get('/user', getAlluser);
router.get('/user/:id', getAuth);
router.get('/user_one/:id', getone)
router.post('/signup', signup);
router.post('/signin', singin);
router.delete('/removeUser/:id', remove);
router.put('/user/:id', edit);
router.get('/user/:id', getAuth);
// router.put('/user/image/:id', upload, editImage);
router.post('/user/creating', uploadStorageUser.single("xlsx"), uploadXlxs);
router.post('/user/comment', commented);

router.get('/user/cart/:id', findCartByUser)
export default router;