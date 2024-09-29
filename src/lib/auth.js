import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { parse, serialize } from "cookie"
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user.id, name: user.name, token: user.token },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  )
}

export default function cookiesSerialize(token) {
  return serialize("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600,
    path: "/",
  })
}

export const verifyTokenFromHeader = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.userEmail = decoded.email
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" })
  }
}

export const verifyToken = (req, res, next) => {
  const { token } = parse(req.headers.cookie || "")
  if (!token) {
    return res.status(403).json({ message: "No token provided" })
  }
  const decoded = jwt.decode(token)
  console.log("Decoded token:", decoded)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    req.id = decoded.id
    console.log(req.id)
    next()
  })
}
