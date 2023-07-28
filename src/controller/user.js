import { getAll, editUser, deleteUser } from "../services/auth";
import Auth from "../module/auth";
export const getAlluser = async (req, res) => {
  try {
      const data = await getAll();
      res.json(data);
  } catch (error) {
      return res.status(400).json({ error: error.message });
  }
}

export const edit = async (req, res) => {
  try {
      const { username, email, password, role, _id, image } = req.body;
      // const { filename } = req.file;
      let datas = {
          username: username,
          email: email,
          image: image,
          password: password,
          role: role
      }
      const data = await editUser(_id, datas);
      res.status(200).json({
          message: "Thành công", data
      })
  } catch (error) {
      return res.status(400).json({ error: error.message });
     
  }
}

export const remove = async (req, res) => {
  const id = req.params.id;
  try {
      var data = await deleteUser(id);
      console.log(data);
      res.status(200).json({
          message: "Thành công", id,

      })
  } catch (error) {
      console.log(error)
      return res.status(400).json({
          message: "Lỗi rồi"
      })
  }
}


export const getone = async (req, res, next) => {
  try {
      const id = req.params.id
      const user = await Auth.findById(id).populate('cart.product', 'name seri image category').exec();
      res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}


export const commented = async (req, res) => {
  try {
      const data = req.body;
      const textComment = await addPost(data);
      res.json(textComment);
      console.log(textComment)
  } catch (error) {
      return res.status(400).json({ error: error.message });
  }
}


export const findCartByUser = async (req, res) => {
  try {
      const _id = req.params.id;
      const data = await Auth.findById(_id).populate('cart.product', 'name seri image category');
      return res.status(200).json(data);
  } catch (error) {
      return res.status(400).json({ error: error.message });
  }
}