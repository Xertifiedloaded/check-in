import {
  handleCreateReply,
  handleGetReplies,
  handleUpdateReply,
  handleDeleteReply,
} from "../../../controller/commentController"

export default async function handler(req, res) {
  const { method } = req
  const { replyId } = req.query

  switch (method) {
    case "POST":
      return handleCreateReply(req, res)

    case "GET":
      return handleGetReplies(req, res)

    case "PATCH":
      return handleUpdateReply(req, res, replyId)

    case "DELETE":
      return handleDeleteReply(req, res, replyId)

    default:
      return res.status(405).json({ error: "Method not allowed" })
  }
}
