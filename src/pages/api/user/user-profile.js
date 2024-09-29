import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
  const { userId, imageUrl } = req.body

  try {
    if (req.method === "GET") {
      if (!userId) {
        return res.status(400).json({ message: "User ID must be provided." })
      }

      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
        },
      })

      if (!userProfile) {
        return res.status(404).json({ message: "User not found." })
      }

      return res.status(200).json({ userProfile })
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID must be provided." })
    }
    
    if (req.method === "POST") {
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL must be provided." })
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!existingUser) {
        return res.status(404).json({ message: "User not found." })
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: imageUrl },
      })

      return res.status(200).json({
        message: "Profile picture updated successfully.",
        profilePicture: updatedUser.profilePicture,
      })
    }



    if (req.method === "DELETE") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return res.status(404).json({ message: "User not found." })
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: null },
      })

      return res
        .status(200)
        .json({ message: "Profile picture deleted successfully." })
    }
    res.setHeader("Allow", ["GET", "POST", "DELETE"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error("Error in profile handler:", error)
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message })
  }
}
