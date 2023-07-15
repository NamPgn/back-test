import express from "express";
import { getAuth } from "../controller/auth";
import { isAdmin, isAuth, requiredSignin } from "../middlewares/checkAuth";
import { uploadUserImageToCloudDinary } from "../controller/image.user";
import { uploadServer } from "../services/upload";
const router = express.Router()

router.post('/user/upload/:id', uploadServer.single('file'), uploadUserImageToCloudDinary);
export default router;