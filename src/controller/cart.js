import Auth from "../module/auth";
import Cart from "../module/cart";

export const getAllCartControllers = async (req, res) => {
  try {
    const data = await Cart.find().populate('product', 'name seri image').populate('user', 'username role');
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
}


export const createCartController = async (req, res) => {
  try {
    const body = req.body;
    const _id = req.params.id;
    await Auth.findByIdAndUpdate(body.user, {
      $push: { cart: { product: body.product } },
    })
    const data = await new Cart(body).save();
    return res.status(200).json(data)
  } catch (error) {
    res.status(400).json({ error: error });
  }
}


export const deleteCartController = async (req, res) => {
  try {
    const product = req.params.id; //id thằng cart
    const userId = req.body.userId; //user id th user
    await Cart.findOneAndDelete({ 'product': product });
    const s = await Auth.findByIdAndUpdate(userId, { //tìm thằng user
      $pull: { cart: { product: product } },
    })
    return res.status(200).json({
      data: s,
      message: 'Delete thành công!'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}