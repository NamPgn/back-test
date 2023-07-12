import { getAll, get, addPost, deleteProduct, editProductSevices } from "../services/products"
import Products from "../module/products";
import admin from 'firebase-admin';
import Category from '../module/category'
import Categorymain from "../module/categorymain";
import Types from "../module/types";
import mongoose from "mongoose";
import WeekCategory from "../module/week.category";
import { DEFAULT_LIMIT } from "../constans/constan";


export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const skip = (page - 1) * DEFAULT_LIMIT; //số lượng bỏ qua
    // lưu trữ dữ liệu
    if (page) {
      const data = await getAll(DEFAULT_LIMIT, skip);

      res.status(200).json(
        {
          data: data,
          length: (await getAll()).length
        }
      );
    } else {
      const data = await getAll();
      res.status(200).json(
        {
          data: data,
          length: (await getAll()).length
        }
      );
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const _id = { _id: req.params.id };
    const data = await Products.findById(_id).populate('comments.user', 'username image').populate('category');
    res.json(data);
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Không ìm thấy phim"
    })
  }
}

const bucketName = process.env.BUCKET_NAME;

export const addProduct = async (req, res) => {
  try {
    const {
      name, category, trailer,
      seri, options, copyright, LinkCopyright,
      descriptions, categorymain,
      image, year, country,
      typeId, view, dailyMotionServer
    } = req.body;
    const folderName = 'image'
    const video = req.files['file'][0];;
    const filename = req.files['image'][0];
    if (filename && video) {
      //ảnh
      if (!filename) {
        res.status(201).json({ message: "không có hình ảnh" });
      }
      if (!video) {
        res.status(201).send({ message: "No video uploaded." });
      }
      const metadataImage = {
        contentType: filename.mimetype
      };
      const fileNameimage = `${folderName}/${Date.now()}-${filename.originalname}`;
      // Tạo đường dẫn đến file trên Firebase Storage
      const file = admin.storage().bucket(bucketName).file(fileNameimage);
      // Tạo stream để ghi dữ liệu video vào Firebase Storage
      const stream = file.createWriteStream({
        metadataImage,
        resumable: false
      });

      //video
      const metadatavideo = {
        contentType: video.mimetype
      };
      // Tạo tên file mới cho video
      const fileNamevideo = `${Date.now()}-${video.originalname ? video.originalname : ''}`;
      // Tạo đường dẫn đến file trên Firebase Storage
      const filevideo = admin.storage().bucket(bucketName).file(fileNamevideo);
      // Tạo stream để ghi dữ liệu video vào Firebase Storage
      const streamvideo = filevideo.createWriteStream({
        metadatavideo,
        resumable: false
      });
      const encodedFileName = encodeURIComponent(fileNameimage)
      streamvideo && stream.on("finish", async () => {

        const urlvideo = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${fileNamevideo}?alt=media`;
        const urlimage = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFileName}?alt=media`;

        const dataAdd = {
          name: name,
          category: category || undefined,
          categorymain: categorymain || undefined,
          seri: seri || undefined,
          options: options,
          descriptions: descriptions,
          link: urlvideo,
          image: urlimage,
          uploadDate: new Date(),
          view: view,
          copyright: copyright,
          LinkCopyright: LinkCopyright,
          typeId: typeId || undefined,
          year: year,
          country: country,
          dailyMotionServer: dailyMotionServer
        }
        const data = await addPost(dataAdd);
        if (data.category) {
          await Category.findByIdAndUpdate(data.category, {
            $addToSet: { products: data._id }
          });
        }

        if (data.categorymain) {
          await Categorymain.findByIdAndUpdate(data.categorymain, {
            $addToSet: { products: data._id }
          });
        }

        if (data.typeId) {
          await Types.findByIdAndUpdate(data.typeId, {
            $addToSet: { products: data._id }
          });
        }
        console.log("data", data);

        return res.json(data);
      })
      stream.on("error", err => {
        console.error(err);
        res.status(500).send({ message: "Failed to upload video." });
      });

      // Ghi dữ liệu video vào stream
      stream.end(filename.buffer);
      // Xử lý sự kiện khi stream ghi dữ liệu bị lỗi
      streamvideo.on("error", err => {
        console.error(err);
        res.status(500).send({ message: "Failed to upload video." });
      });

      // Ghi dữ liệu video vào stream
      streamvideo.end(video.buffer);
    } else {
      const dataAdd = {
        name: name,
        category: category,
        seri: seri,
        descriptions: descriptions,
        uploadDate: new Date(),
        view: view,
        copyright: copyright,
        LinkCopyright: LinkCopyright,
        trailer: trailer,
        dailyMotionServer: dailyMotionServer
      }
      const data = await addPost(dataAdd);
      console.log("data", dataAdd);
      res.json(data);
    }
    // Xử lý sự kiện khi stream ghi dữ liệu thành công
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message,
    });
  }
}

export const delete_ = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const folderName = 'image';
    const deletedProduct = await Products.findById(id);
    if (!deletedProduct) {
      // Sản phẩm không tồn tại
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Xóa tệp video từ Firebase Storage
    const videoFileName = deletedProduct.link.split('/').pop().split('?alt=media')[0]; // Lấy tên tệp video từ URL
    console.log(videoFileName);
    const videoFile = admin.storage().bucket(bucketName).file(videoFileName);
    if (videoFileName) {
      await videoFile.delete();
    }

    // Xóa tệp hình ảnh từ Firebase Storage
    const imageFileName = deletedProduct.image.split(`/`).pop().split('?alt=media')[0]; // Lấy tên tệp hình ảnh từ URL
    const decodedImage = decodeURIComponent(imageFileName).split('/')[1]; //
    const imageFile = admin.storage().bucket(bucketName).file(`${folderName}/${decodedImage}`); //còn thằng này không có folder mà là lấy chay nên phải lấy ra thằng cuối cùng .
    console.log(decodedImage, imageFileName);
    if (decodedImage) {
      await imageFile.delete();
    }

    if (deletedProduct.typeId) {
      await Types.findByIdAndUpdate(deletedProduct.typeId, { //tìm thằng type
        $pull: { products: { $in: [id] } },
      });
    }

    if (deletedProduct.categorymain) {
      await Categorymain.findByIdAndUpdate(deletedProduct.categorymain, { //tìm thằng categorymain
        $pull: { products: { $in: [id] } },
      });
    }

    if (deletedProduct.category) {
      await Categorymain.findByIdAndUpdate(deletedProduct.category, { //tìm thằng category
        $pull: { products: { $in: [id] } }, // tìm tất ca thằng product trong list category có id trùng vs thằng id product
      });
    }
    await deleteProduct(id);
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: error.message
    })
  }
}

export const editProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const folderName = 'image';
    const {
      name,
      category,
      categorymain,
      year,
      country,
      typeId,
      seri,
      options,
      copyright,
      LinkCopyright,
      descriptions,
      trailer,
      dailyMotionServer
    } = req.body;


    // const data = await editProductSevices(_id, dataEdit);
    const findById = await Products.findById(id);
    // Kiểm tra sản phẩm có tồn tại trong CSDL hay không
    if (!findById) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    findById.name = name;
    findById.seri = seri || undefined;
    findById.descriptions = descriptions;
    // image: image,
    // link: link,
    findById.seri = seri;
    findById.options = options;
    findById.copyright = copyright;
    findById.LinkCopyright = LinkCopyright;
    findById.trailer = trailer;
    findById.country = country;
    findById.year = year;
    findById.dailyMotionServer = dailyMotionServer
    findById.categorymain = categorymain || undefined;
    findById.category = category || undefined;
    findById.typeId = typeId || undefined;

    const newVideoFile = req.files['file'] && req.files['file'][0];;
    const newImageFile = req.files['image'] && req.files['image'][0];

    if (newVideoFile || newImageFile) {



      const metadataImage = {
        contentType: newImageFile.mimetype
      }
      const metadataVideo = {
        contentType: newVideoFile.mimetype
      }

      const fileNameImage = `${folderName}/${Date.now()}-${newImageFile.originalname}`;
      const fileNameVideo = `${Date.now()}-${newVideoFile.originalname}`;

      const fileImage = admin.storage().bucket(bucketName).file(fileNameImage);
      const fileVideo = admin.storage().bucket(bucketName).file(fileNameVideo);

      const streamImage = fileImage.createWriteStream({
        metadata: metadataImage,
        resumable: false
      });

      const streamVideo = fileVideo.createWriteStream({
        metadata: metadataVideo,
        resumable: false
      });

      //encode url
      const encodedFileName = encodeURIComponent(fileNameImage);
      streamImage || streamVideo.on('finish', async () => {

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFileName}?alt=media`;
        const videoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${fileNameVideo}?alt=media`;

        //cập nhật
        findById.seri = seri;
        findById.options = options;
        findById.copyright = copyright;
        findById.LinkCopyright = LinkCopyright;
        findById.trailer = trailer;
        findById.country = country;
        findById.year = year;
        findById.image = imageUrl;
        findById.link = videoUrl;
        findById.dailyMotionServer = dailyMotionServer
        findById.typeId = typeId || undefined;
        findById.category = category || undefined;
        findById.categorymain = categorymain || undefined;
        // lưu vào database
        const data = await findById.save();

        return res.status(200).json({ success: true, message: "Dữ liệu sản phẩm đã được cập nhật.", data: data });
      })
    } else {
      // Không có tệp hình ảnh mới, chỉ cập nhật các thông tin khác của sản phẩm
      findById.options = options;
      findById.copyright = copyright;
      findById.LinkCopyright = LinkCopyright;
      findById.trailer = trailer;
      findById.country = country;
      findById.year = year;
      findById.dailyMotionServer = dailyMotionServer
      findById.seri = seri || undefined;
      findById.categorymain = categorymain;
      findById.typeId = typeId;
      findById.category = category;

      await findById.save();
      return res.status(200).json({ success: true, message: "Dữ liệu sản phẩm đã được cập nhật.", data: findById });
    }
    // add
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message
    })
  }
}

export const deleteMultipleProduct = async (req, res) => {
  try {
    const id = req.body;
    const data = await Products.remove({
      "_id": {
        $in: id
      }
    })
    console.log("id", data, "id", id);
    return res.status(200).json({
      data: data,
      id: id
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

////12324tw7rt87wery8q7weyr78qwer

export const getAllProductsByCategory = async (req, res) => {
  try {
    const id = req.params.id;
    // const data = await Products.aggregate([
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "category",
    //       foreignField: "_id",
    //       as: "category"
    //     }
    //   },
    //   {
    //     $match: {
    //       "category._id": mongoose.Types.ObjectId(categoryId)
    //     }
    //   }
    // ]);
    const categoryId = mongoose.Types.ObjectId(id);
    const data = await Products.find({ category: categoryId })

    res.json(data);

    //Trong đó:
    // $lookup là phương thức kết hợp (join) dữ liệu từ hai bảng Products và categories.
    // from là tên bảng categories.
    // localField là trường category trong bảng Products.
    // foreignField là trường _id trong bảng categories.
    // as là tên mới cho trường category sau khi thực hiện join.
    // $match là phương thức lọc dữ liệu, chỉ lấy các sản phẩm có trường category._id bằng với categoryId.

  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const findCommentByIdProduct = async (req, res) => {
  try {
    const _id = { _id: req.params.id };
    console.log("_id", _id);
    const data = await Products.findById(_id).populate('comments.user', 'username image');
    res.json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}


export const pushtoTypes = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const data = await Products.findById(id);
    const newData = await Types.findByIdAndUpdate(body.typeId, {
      $addToSet: { products: data }
    });
    res.json(newData);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const pushToWeek = async (req, res) => {
  try {
    const productId = req.params.id;
    const body = req.body;
    const data = await Products.findById(productId);
    const newData = await WeekCategory.findByIdAndUpdate(body.weekId, {
      $addToSet: { products: data },
    })
    res.json(newData);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}