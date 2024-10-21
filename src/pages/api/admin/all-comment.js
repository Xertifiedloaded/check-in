import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {

    if (req.method === 'GET') {
      try {
        const comments = await prisma.comment.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            post: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        });
        return res.status(200).json(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Error fetching comments', error: error.message });
      }
    } else if (req.method === 'DELETE') {
      const { commentId } = req.body;
  
      if (!commentId) {
        return res.status(400).json({ message: 'Comment ID is required' });
      }
  
      try {
        await prisma.comment.delete({
          where: { id: commentId },
        });
        return res.status(200).json({ message: 'Comment successfully deleted' });
      } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Error deleting comment', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }