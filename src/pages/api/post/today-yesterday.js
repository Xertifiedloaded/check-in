
import { prisma } from "@/lib/prisma"
import { startOfToday, startOfYesterday } from "date-fns"

export default async function handler(req, res) {
  try {
    const today = startOfToday();
    const yesterday = startOfYesterday();
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            createdAt: {
              gte: today, 
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), 
            },
          },
          {
            createdAt: {
              gte: yesterday, 
              lt: today, 
            },
          },
        ],
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
    const recentPostsMap = new Map();
    for (const post of posts) {
      const userId = post.userId;
      if (!recentPostsMap.has(userId)) {
        recentPostsMap.set(userId, post);
      } else {
        const existingPost = recentPostsMap.get(userId);
        if (post.createdAt > existingPost.createdAt) {
          recentPostsMap.set(userId, post);
        }
      }
    }

    const recentPosts = Array.from(recentPostsMap.values());

    res.status(200).json(recentPosts);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
}
