import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {

    if (req.method === 'GET') {
      try {
        const replies = await prisma.reply.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            comment: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        });
        return res.status(200).json(replies);
      } catch (error) {
        console.error('Error fetching replies:', error);
        return res.status(500).json({ message: 'Error fetching replies', error: error.message });
      }
    } else if (req.method === 'DELETE') {
      const { replyId } = req.body;
      if (!replyId) {
        return res.status(400).json({ message: 'Reply ID is required' });
      }
  
      try {
        await prisma.reply.delete({
          where: { id: replyId },
        });
        return res.status(200).json({ message: 'Reply successfully deleted' });
      } catch (error) {
        console.error('Error deleting reply:', error);
        return res.status(500).json({ message: 'Error deleting reply', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  