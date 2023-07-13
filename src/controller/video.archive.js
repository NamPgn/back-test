// const FormData = require("form-data");
// const fs = require("fs");
// const request = require("request");
// // Khởi tạo đối tượng multer

// // Middleware để xử lý tải lên file video
// export const uploadVideoAchive = async (req, res) => {
//   try {
//     // Lấy đường dẫn đến file video được tải lên
//     const formData = {
//       file: {
//         value: fs.createReadStream(req.file.path),
//         options: {
//           filename: req.file.originalname,
//           contentType: req.file.mimetype
//         }
//       },
//       metadata: JSON.stringify({
//         title: 'Tên video',
//         description: 'Mô tả video',
//         collection: 'opensource_movies',
//         mediatype: 'movies',
//       })
//     };
  
//     const auth = {
//       user: 'USERNAME',
//       pass: 'PASSWORD'
//     };
  
//     request.post({
//       url: 'https://archive.org/upload',
//       formData: formData,
//       auth: auth
//     }, function (err, httpResponse, body) {
//       if (err) {
//         console.error('Lỗi: ', err);
//         res.status(500).send('Lỗi tải lên tệp');
//       } else {
//         console.log('Upload thành công!');
//         console.log('Kết quả: ', body);
//         const response = JSON.parse(body);
//         const videoUrl = response.details.item_link;
//         console.log('URL của video: ', videoUrl);
//         res.send('Tải lên tệp thành công');
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error uploading video to Archive");
//   }
// };
