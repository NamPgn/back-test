import jwt from "jsonwebtoken"
export const generateToken = (payload) => {
    const token = jwt.sign(payload, "nampg", { expiresIn: '365d' })
    return token;
}
export const verifyToken = (data) => {
    return jwt.verify(data);
}