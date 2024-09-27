import databaseConnection from "@/lib/database"
import UserModel from "@/models/UserModel"
import cookiesSerialize, { comparePassword, generateToken } from "@/lib/auth"

export default async function handler(req, res) {
  await databaseConnection()

  if (req.method === "POST") {
    const { email, password } = req.body

    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
      }
      if (user.isGoogleAuth) {
        return res.status(400).json({ message: "Please log in with Google" })
      }
      console.log(user)
      const isMatch = await comparePassword(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" })
      }
      const token = generateToken(user)
      user.token = token
      const cookie = cookiesSerialize(token)
      res.setHeader("Set-Cookie", cookie)
      res.status(200).json({ user, token })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
