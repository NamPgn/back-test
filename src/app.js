import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import routerAuth from "./routes/auth";
import routerProducts from "./routes/products.js";
import routerCategory from "./routes/category.js";
import routerPostList from "./routes/post.js";
import routerTrailer from "./routes/trailer.home";
import routerComments from "./routes/comment.js";
import admin from "firebase-admin";
import routerCart from "./routes/cart.js";
import routerTypes from "./routes/types.js";
import routerCategorymain from "./routes/categorymain.js";
import routerImage from './routes/image.user'
import serviceAccount from "../public/path/mystorage-265d8-firebase-adminsdk-4jj90-9c56ceaf71.json";
import routerWeek from "./routes/week.category";
const port = process.env.PORT || 3000;

const routers = [
  routerAuth,
  routerProducts,
  routerCategory,
  routerPostList,
  routerTrailer,
  routerComments,
  routerCart,
  routerTypes,
  routerCategorymain,
  routerWeek,
  routerImage
];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin:"https://tromphim.netlify.app/"
}));

routers.map((router) => app.use("/api", router));

app.get("/", (req, res) => {
  res.send("Đmm");
});

try {
  mongoose.connect(`${process.env.URI}`);
  console.log("Kết nôt mongodb thành công");
} catch (error) {
  console.log("lỗi rồi");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

app.listen(port, async () => {
  console.log(`Server is running on: http://localhost:${port}`);
});


//https://accounts.google.com/o/oauth2/token?scope=https://www.googleapis.com/auth/drive&client_id=949752774575-9bh3rqk5j6ntflgkikluk7jhd8kiihfi.apps.googleusercontent.com&redirect_uri=http://localhost:8000&response_type=code&access_type=offline
//https://accounts.google.com/o/oauth2/token?code