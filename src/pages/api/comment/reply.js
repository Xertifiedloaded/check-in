import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { commentId, replyId } = req.query;

  try {
    switch (method) {
      case 'GET':
        if (commentId) {
          const replies = await prisma.reply.findMany({
            where: { commentId: parseInt(commentId) },
            include: { user: true }, 
          });
          return res.json(replies);
        }
        return res.status(400).json({ error: 'Comment ID is required' });

      case 'POST':
        if (commentId) {
          const { content, userId } = req.body;
          const newReply = await prisma.reply.create({
            data: {
              content,
              userId: userId,
              commentId: commentId,
            },
          });
          
          return res.status(201).json(newReply);
        }
        return res.status(400).json({ error: 'Comment ID is required' });

      case 'PATCH':
        if (replyId) {
          const { content } = req.body;
          const updatedReply = await prisma.reply.update({
            where: { id: parseInt(replyId) },
            data: { content },
          });
          return res.json(updatedReply);
        }
        return res.status(400).json({ error: 'Reply ID is required' });

      case 'DELETE':
        if (replyId) {
          await prisma.reply.delete({
            where: { id: parseInt(replyId) },
          });
          return res.status(204).end();
        }
        return res.status(400).json({ error: 'Reply ID is required' });

      default:
        return res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']).status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: 'Server error' });
  }
}
