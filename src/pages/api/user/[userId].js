import databaseConnection from "@/lib/database"
import UserModel from "@/models/UserModel"

export default async function handler(req, res) {
  await databaseConnection()
  const { userId } = req.query

  if (req.method === "GET") {
    try {
      const user = await UserModel.findById(userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      return res.status(500).json({ message: "Server error" })
    }
  }
  if (req.method === "DELETE") {
    try {
      const user = await UserModel.findById(userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      await UserModel.findByIdAndDelete(userId)
      return res
        .status(200)
        .json({ message: "User account deleted successfully" })
    } catch (error) {
      console.error("Error deleting user:", error)
      return res.status(500).json({ message: "Server error" })
    }
  }
  if (req.method === "PATCH") {
    const { newEmail, newName } = req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (newEmail && !emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (newEmail) user.email = newEmail
    if (newName) user.name = newName

    await user.save()

    return res.status(200).json({
      message: "User details updated successfully",
      id: user._id,
      userId: userId,
      name: user.name,
      email: user.email,
    })
  }

  res.setHeader("Allow", ["GET", "DELETE", "PATCH"])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
