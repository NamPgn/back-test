import { addUser, getAll, getUser, editUser, deleteUser, getDataUser } from "../services/auth";
import { generateToken } from "../services/requestToken";
import { comparePassWord, passwordHash } from "../services/security";
import { sendMail } from "../utills/mailer";
import Auth from "../module/auth";

export const signup = async (req, res) => {
    try {
        const { username, email, password, role, image } = req.body;
        // const { filename } = req.file;
        // filename ? filename : "https://taytou.com/wp-content/uploads/2022/08/Tai-anh-dai-dien-cute-de-thuong-hinh-meo-nen-xanh-la.png";

        // console.log("req.file", filename)

        const getuser = await getDataUser({ username: username }); //tìm lấy ra cái thằng email
        if (getuser) { //kiểm tra nếu mà nó email đã tồn tại thì trả về cái lỗi
            res.status(401).json({
                success: false,
                message: 'Tài khoản đã tồn tại'
            })
            return;
        }
        // mã hóa mật khẩu
        var hashPw = passwordHash(password);
        const newUser = {
            username: username,
            // email: email,
            password: hashPw,
            // image: image,
            // image: `http://localhost:${process.env.PORT}/images/` + filename,
            role: role
        }
        console.log("newUsser", newUser)
        await addUser(newUser)
        return res.status(200).json({
            success: true,
            message: "Thành công",
            newUser: [newUser]
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: "Không đăg kí dđược "
        })
    }
}

export const singin = async (req, res) => {
    try {
        const { password, username } = req.body;
        const getUserLogin = await getDataUser({ username: username })
        if (!getUserLogin) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Tài khoản không tồn tại'
                }
            )
        }

        const comparePw = comparePassWord(password, getUserLogin.password);
        if (!comparePw) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Nhập lại mật khẩu đi'
                }
            )
        }
        const user = {
            _id: getUserLogin._id,
            username: getUserLogin.username,
            // email: getUserLogin.email,
            role: getUserLogin.role,
            // image: getUserLogin.image
        }
        const tokenAuth = generateToken(user)

        // send mail with defined transport object


        // const mailOptions = {
        //     from: `${process.env.EMAIL}`,
        //     to: `${email}`,
        //     subject: 'Nam chào bạn',
        //     text: 'This is a test email from Node.js'
        // };
        // sendMail(mailOptions);

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thành công',
            token: tokenAuth,
            message: "Đăng nhập thành công!",
            user: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

export const getAlluser = async (req, res) => {
    try {
        const data = await getAll();
        res.json(data);
    } catch (error) {
        console.log(error);
    }
}

export const edit = async (req, res) => {
    try {
        const { username, email, password, role, _id, image } = req.body;
        // const { filename } = req.file;
        const payload = req.body;
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
        console.log(error);
        return res.status(400).json({
            message: "Lỗi rồi"
        })
    }
}

// export const editImage = async (req, res) => {
//     try {
//         const { filename } = req.file;
//         const { id } = req.params;
//         const payload = {
//             image: `http://localhost:8000/images/` + filename,
//         }
//         const data = await editImg(id, payload);
//         console.log("data", data);
//         res.json(data);
//     } catch (error) {
//         return res.status(400).json({
//             message: "Lỗi rồi"
//         })
//         console.log(error);
//     }
// }

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

export const getAuth = async (req, res, next, id) => {
    try {
        const user = await Auth.findById(id).exec();
        if (!user) {
            res.status(400).json({
                message: "Khong tim thay user"
            })
        }
        req.profile = user
        req.profile.password = undefined;
        next();
    } catch (error) {
        console.log(error)
    }
}

export const getone = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await Auth.findById(id).exec();
        res.json(user)
    } catch (error) {
        console.log(error)
    }
}


export const commented = async (req, res) => {
    try {
        const data = req.body;
        const textComment = await addPost(data);
        res.json(textComment);
        console.log(textComment)
    } catch (error) {
        console.log(error);
    }
}


export const findCartByUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await Auth.findById(_id).populate('cart.product', 'name seri image category');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
}