import { prisma } from "@/lib/prisma"
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const { method } = req
  const { userId, content, postId } = req.body || req.query

  if (userId && !/^[0-9a-fA-F]{24}$/.test(userId)) {
    return res.status(400).json({ message: "Invalid User ID format" })
  }

  if (postId) {
    if (!/^[0-9a-fA-F]{24}$/.test(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" })
    }
  }

  switch (method) {
    case "GET":
      try {
        // Get the user's session
        const session = await getSession({ req })
        if (!session || !session.user || !session.user.id) {
          return res.status(401).json({ message: "Unauthorized" })
        }

        const userId = session.user.id

        const posts = await prisma.post.findMany({
          where: { userId: userId },
          include: {
            user: {
              select: {
                name: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        if (!posts.length) {
          return res
            .status(404)
            .json({ message: "No posts found for this user" })
        }

        return res.status(200).json(posts)
      } catch (error) {
        console.error("Error fetching posts:", error)
        return res
          .status(500)
          .json({ error: "An error occurred while fetching posts" })
      }

    case "PATCH":
      try {
        const post = await prisma.post.findUnique({
          where: { id: postId },
        })

        if (!post) {
          return res.status(404).json({ message: "Post not found" })
        }
        if (post.userId !== userId) {
          return res
            .status(403)
            .json({ message: "Not authorized to edit this post" })
        }
        if (!content || content.trim() === "") {
          return res.status(400).json({ message: "Content cannot be empty" })
        }
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { content: content.trim() },
        })

        return res
          .status(200)
          .json({ message: "Post updated successfully", updatedPost })
      } catch (error) {
        console.error("Error updating post:", error)
        return res
          .status(500)
          .json({ error: "An error occurred while editing the post" })
      }

    case "DELETE":
      try {
        const post = await prisma.post.findUnique({
          where: { id: postId },
        })

        if (!post) {
          return res.status(404).json({ message: "Post not found" })
        }
        if (post.userId !== userId) {
          return res
            .status(403)
            .json({ message: "Not authorized to delete this post" })
        }
        await prisma.post.delete({
          where: { id: postId },
        })

        return res.status(200).json({ message: "Post deleted successfully" })
      } catch (error) {
        console.error("Error deleting post:", error)
        return res
          .status(500)
          .json({ error: "An error occurred while deleting the post" })
      }

    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}
