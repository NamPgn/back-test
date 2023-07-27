import express from "express";
import { getAuth } from "../controller/auth";
import { isAuth, requiredSignin } from "../middlewares/checkAuth";
import { uploadUserImageToCloudDinary } from "../controller/image.user";
import { uploadServer } from "../services/upload";
const router = express.Router()

router.post('/user/upload/:userId', requiredSignin, isAuth, uploadServer.single('file'), uploadUserImageToCloudDinary);
router.param('userId', getAuth)
export default router;