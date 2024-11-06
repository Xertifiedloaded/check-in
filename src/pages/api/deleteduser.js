import { prisma } from "../../lib/prisma";


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const deletedUsers = await prisma.user.findMany({
      where: {
        isDeleted: true
      }
    });

    const nonDeletedUsers = await prisma.user.findMany({
      where: {
        isDeleted: false
      }
    });

    const postsWithNonDeletedUsers = await prisma.post.findMany({
      where: {
        user: {
          isDeleted: false
        }
      },
      include: {
        user: true
      }
    });

    console.log('Deleted users:', deletedUsers.length);
    console.log('Non-deleted users:', nonDeletedUsers.length);
    console.log('Posts with non-deleted users:', postsWithNonDeletedUsers.length);

    res.status(200).json({ 
      deletedUsersCount: deletedUsers.length, 
      nonDeletedUsersCount: nonDeletedUsers.length, 
      postsWithNonDeletedUsersCount: postsWithNonDeletedUsers.length 
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
}