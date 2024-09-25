import { generateToken } from "@/lib/auth"
import databaseConnection from "@/lib/database"
import UserModel from "@/models/UserModel"

export default async function handler(req, res) {
  await databaseConnection()
  if (req.method === "POST") {
    const { name, email, password, passwordConfirm } = req.body

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    try {
      const existingUser = await UserModel.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }

      const newUser = await UserModel.create({
        name,
        email,
        password,
      })

      const token = generateToken(newUser)
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
        token,
      })
    } catch (error) {
      console.error("Error creating user:", error)
      res.status(500).json({ message: "Server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
