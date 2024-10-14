
import { generateEmailHTML } from "@/lib/CommentHtml"
import { sendEmailCommentNotification } from "@/lib/emailContent"
import { prisma } from "@/lib/prisma"

export default async function handleGetComments(req, res) {
  const { postId } = req.query

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    res.status(200).json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    res.status(500).json({ error: "Unable to fetch comments" })
  }
}



export async function handleCreateComment(req, res, userId) {
  const { content, postId } = req.body;

  try {

    const comment = await prisma.comment.create({
      data: { content, userId, postId },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
        post: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const postOwner = comment.post.user;
    const commentAuthor = comment.user.name;

    await sendEmailCommentNotification({
      to: postOwner.email,
      subject: "New Comment on Your Post",
      html: generateEmailHTML(postOwner, commentAuthor, content),
    });


    const previousCommenters = await prisma.comment.findMany({
      where: {
        postId: postId,
        NOT: {
          userId: userId, 
        },
      },
      select: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const notificationPromises = previousCommenters.map(async (comment) => {
      const commenterEmail = comment.user.email;
      return sendEmailCommentNotification({
        to: commenterEmail,
        subject: "A New Comment Has Been Added",
        html: generateEmailHTML(postOwner, commentAuthor, content),
      });
    });

    await Promise.all(notificationPromises);
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(400).json({ error: "Unable to create comment" });
  }
}


export async function handleUpdateComment(req, res, userId) {
  const { commentid } = req.query
  const { content } = req.body
  if (!commentid || !content) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentid },
    })

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" })
    }

    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" })
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentid },
      data: { content },
      include: { user: { select: { name: true } } },
    })

    res.status(200).json(updatedComment)
  } catch (error) {
    console.error("Error updating comment:", error)
    res.status(400).json({ error: "Unable to update comment" })
  }
}

export async function handleDeleteComment(req, res, userId) {
  const { commentid } = req.query
  if (!commentid) {
    return res.status(400).json({ error: "Missing comment ID" })
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentid },
    })
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" })
    }
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" })
    }
    await prisma.comment.delete({ where: { id: commentid } })
    res.status(204).end()
  } catch (error) {
    console.error("Error deleting comment:", error)
    res.status(400).json({ error: "Unable to delete comment" })
  }
}
