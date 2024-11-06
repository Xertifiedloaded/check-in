import { prisma } from "../lib/prisma";

export async function handleDeleteUserPost(postId, userId, res) {
    try {

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true, userId: true },
      });
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found.",
        });
      }
  
      if (post.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to delete this post.",
        });
      }
  
      await prisma.post.delete({
        where: { id: postId },
      });
  
      return res.status(200).json({
        success: true,
        message: "Post deleted successfully.",
      });
    } catch (error) {
      console.error("Post deletion error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete post.",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  }
  


  export async function handleUpdateUserPost(postId, userId, updateData, res) {
    const { content, visibility } = updateData;
  
    try {

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true, userId: true },
      });
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found.",
        });
      }
  
      // Ensure that the user owns the post
      if (post.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this post.",
        });
      }
  
      // Update the post
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          content: content !== undefined ? content : undefined,
          visibility: visibility !== undefined ? visibility : undefined,
        },
        select: {
          id: true,
          content: true,
          visibility: true,
          createdAt: true,
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "Post updated successfully.",
        data: updatedPost,
      });
    } catch (error) {
      console.error("Post update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update post.",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  }
  