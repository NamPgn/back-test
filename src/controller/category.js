import { addCategory, getAllCategory, getCategory, updateCategory, deleteCategory } from "../services/category"
import Products from "../module/products";
import Category from "../module/category";
import WeekCategory from "../module/week.category";
import weekCategory from "../module/week.category";
import admin from 'firebase-admin';
const bucketName = process.env.BUCKET_NAME;
export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const default_limit = 10;
    await Category.createIndexes();
    if (page) {
      const skip = (page - 1) * default_limit; //số lượng bỏ qua
      const data = await getAllCategory(default_limit, skip);
      res.json(data);
    } else {
      const data = await getAllCategory(default_limit);
      res.json(data);
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getCategory(id);
    res.json(data)
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const readProductByCategory = async (req, res) => {
  try {
    const data = await Products.find().populate('category', 'name');
    res.json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const addCt = async (req, res) => {
  try {

    const { name, linkImg, sumSeri, des, type, week } = req.body;
    const file = req.file;
    const folderName = 'category';

    const metadatavideo = {
      contentType: file.mimetype
    };
    const fileName = `${folderName}/${Date.now()}-${file.originalname}`;
    const files = admin.storage().bucket(bucketName).file(fileName);
    const streamvideo = files.createWriteStream({
      metadatavideo,
      resumable: false
    });

    const encodedFileName = encodeURIComponent(fileName);
    streamvideo.on('finish', async () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFileName}?alt=media`;
      const newDt = {
        name: name,
        linkImg: url,
        des: des,
        sumSeri: sumSeri,
        type: type,
        week:week
      }
      const cate = await addCategory(newDt);
      await WeekCategory.findByIdAndUpdate(cate.week, {
        $addToSet: { category: cate._id }
      });
      return res.json(cate);
    })
    // Ghi dữ liệu video vào stream
    streamvideo.end(file.buffer);
    // Xử lý sự kiện khi stream ghi dữ liệu bị lỗi
    streamvideo.on("error", err => {
      console.error(err);
      res.status(500).send({ message: "Failed to upload video." });
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const updateCate = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params
    const dataEdit = await updateCategory(id, data);
    // Cập nhật thông tin category tương ứng trong bảng week
    await WeekCategory.findOneAndUpdate(
      { _id: dataEdit.week },
      { $set: { "category.$[elem]": dataEdit } },
      { arrayFilters: [{ "elem._id": dataEdit._id }] }
    );
    res.json(dataEdit);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deleteCategory(id);
    await WeekCategory.findByIdAndDelete(data.week, {
      $pull: { category: data._id }
    })
    return res.json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}
export const getAllCategoryNotReq = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Category.find({ _id: { $ne: id } })
    res.json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const searchCategory = async (req, res) => {
  try {

    var searchValue = req.query.value;
    var regex = new RegExp(searchValue, 'i');
    const data = await Category.find({
      $or: [{ name: regex }]
    })
    res.json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const push = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const body = req.body;
    const data = await Category.findById(categoryId);
    const newData = await weekCategory.findByIdAndUpdate(body.weekId, {
      $addToSet: { category: data },
    })
    res.json(newData);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}