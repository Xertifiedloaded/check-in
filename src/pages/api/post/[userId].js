import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { userId } = req.query;  

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId, 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
