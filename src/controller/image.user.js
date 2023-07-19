import Auth from "../module/auth";
import imageUser from "../module/image.user";
const cloudinary = require('cloudinary').v2;
// Thiết lập Cloudinary
cloudinary.config({
  cloud_name: 'daz3lejjo',
  api_key: '688737596312288',
  api_secret: '8jT_u3ngBLdt9a0cnaghNp8f7Wg'
});


export const uploadUserImageToCloudDinary = (req, res) => {
  try {
    const id = req.params.id;
    cloudinary.uploader.upload(req.file.path, {
      folder: 'user',
      public_id: req.file.originalname,
      overwrite: true,
    }, async (error, result) => {
      if (error) {
        return res.status(500).json(error);
      }
      const newImage = await new imageUser({
        url: result.url,
        user_id: id
      }).save();
      const data = await Auth.findByIdAndUpdate(id, {
        $set: { image: newImage.url }
      })
      return res.status(200).json({
        data: data,
        code: 200
      });
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      code: 500
    });
  }
}