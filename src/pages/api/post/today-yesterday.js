import { prisma } from "@/lib/prisma";
import { startOfToday, startOfYesterday } from "date-fns";

export default async function handler(req, res) {
  try {
    const today = startOfToday();
    const yesterday = startOfYesterday();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const posts = await prisma.post.findMany({
      where: {
        visibility: {
          in: ["PUBLIC", "public"],
        },
        OR: [
          {
            createdAt: {
              gte: today,
              lt: tomorrow,
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
            username: true,
            isVerified: true,
            isOwner: true,
            profilePicture: true,
            streaks: {
              select: {
                currentStreak: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const todayPostsMap = new Map();
    const yesterdayPostsMap = new Map();

    for (const post of posts) {
      const userId = post.userId;
      const postDay = post.createdAt >= today ? "today" : "yesterday";

      const currentStreak =
        post.user.streaks.length > 0 ? post.user.streaks[0].currentStreak : 0;

      const postData = {
        ...post,
        likeCount: post.likes.length,
        content: post.content,
        commentCount: post.comments.length,
        currentStreak,
      };

      if (postDay === "today") {
        if (
          !todayPostsMap.has(userId) ||
          post.createdAt > todayPostsMap.get(userId).createdAt
        ) {
          todayPostsMap.set(userId, postData);
        }
      }

      if (postDay === "yesterday") {
        if (
          !yesterdayPostsMap.has(userId) ||
          post.createdAt > yesterdayPostsMap.get(userId).createdAt
        ) {
          yesterdayPostsMap.set(userId, postData);
        }
      }
    }

    const todayPosts = Array.from(todayPostsMap.values());
    const yesterdayPosts = Array.from(yesterdayPostsMap.values());

    res.status(200).json({ todayPosts, yesterdayPosts });
  } catch (error) {
    console.error("Error fetching posts: ", error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  } finally {
    await prisma.$disconnect();
  }
}
