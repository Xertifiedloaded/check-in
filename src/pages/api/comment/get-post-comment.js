export async function handleGetPostWithUserComment(req, res) {
    const { postId, userId } = req.params; // Extract postId and userId from the request parameters
  
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId }, 
        include: {
          comments: {
            where: { userId: userId }, 
            include: {
              user: {
                select: {
                  name: true,
                  profilePicture: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
        },
      });
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Error fetching post" });
    }
  }