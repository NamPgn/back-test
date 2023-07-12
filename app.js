import express from "express"
import "dotenv/config"
import cors from "cors"
import mongoose from "mongoose";
import routerAuth from "./src/routes/auth";
import routerProducts from "./src/routes/products.js"
import routerCategory from "./src/routes/category.js";
import routerPostList from "./src/routes/post.js";
import routerTrailer from "./src/routes/trailer.home"
import routerComments from "./src/routes/comment.js";
import admin from 'firebase-admin';
import routerCart from "./src/routes/cart.js";
import routerTypes from "./src/routes/types.js";
import routerCategorymain from "./src/routes/categorymain.js";
import serviceAccount from './public/path/mystorage-265d8-firebase-adminsdk-4jj90-9c56ceaf71.json';
import routerWeek from "./src/routes/week.category";
import { createClient } from 'redis';

const port = process.env.PORT || 3000;

// const client = createClient();

// client.on('error', err => console.log('Redis Client Error', err));

// client.connect();

// console.log(client);

console.log(null ?? "giang");


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
    routerWeek
]

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

routers.map(router => app.use("/api", router))

app.get('/', (req, res) => {
    res.send("Đmm");
});


try {
    mongoose.connect(`${process.env.URI}`);
    console.log("Kết nôt mongodb thành công")
} catch (error) {
    console.log("lỗi rồi")
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
})

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
});