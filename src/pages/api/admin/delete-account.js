import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          streak: true,
        },
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await prisma.$transaction(async (tx) => {

        await tx.reply.deleteMany({
          where: { userId }
        });

        await tx.comment.deleteMany({
          where: { userId }
        });
        await tx.post.deleteMany({
          where: { userId }
        });
        await tx.streak.deleteMany({
          where: { userId }
        });
        // Soft delete to keep the history of the user
        await tx.user.update({
          where: { id: userId },
          data: {
            isDeleted: true,
            deletedAt: new Date(),
            email: `deleted_${userId}@deleted.com`, 
          }
        });

        // Or hard delete to delete the user and history
        // await tx.user.delete({
        //   where: { id: userId }
        // });
      });

      return res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ 
        message: 'Error deleting user', 
        error: error.message,
        details: 'An error occurred while deleting the user and their associated data'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}