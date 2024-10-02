import handleGetComments, { handleCreateComment, handleDeleteComment, handleUpdateComment } from "@/controller/commentController"
import { authOptions } from "@/lib/authOptions"
import { socketHandler } from "@/lib/socket"
import { getServerSession } from "next-auth"

export default async function handler(req, res) {
  // socketHandler(req,res)
  switch (req.method) {
    case "GET":
      return handleGetComments(req, res)
    case "POST":
    case "PATCH":
    case "DELETE":
      const session = await getServerSession(req, res, authOptions)
      
      if (!session || !session.user || !session.user.id) {
        return res
          .status(401)
          .json({ message: "You must be logged in to perform this action." })
      }
      const userId = session.user.id
      if (req.method === "POST") {
        return handleCreateComment(req, res, userId)
      } else if (req.method === "PATCH") {
        return handleUpdateComment(req, res, userId)
      } else if (req.method === "DELETE") {
        return handleDeleteComment(req, res, userId)
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}