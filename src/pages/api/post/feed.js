import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
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
        createdAt: 'desc',
      },
    });

    const serializedPosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      comments: post.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      })),
    }));

    res.status(200).json({ posts: serializedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}