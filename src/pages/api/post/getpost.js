import { prisma } from "@/lib/prisma"

export default async function handler(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified:true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', 
      },
    })

    res.status(200).json(posts)
  } catch (error) {
    console.error("Error fetching posts: ", error)
    res.status(500).json({ error: "An error occurred while fetching posts." })
  }
}
