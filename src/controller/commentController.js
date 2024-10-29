import {
  generateCommentHtml,
  generateEmailHTML,
  generateReplyEmailHTML,
} from "@/lib/CommentHtml"
import { sendEmailCommentNotification } from "@/lib/emailContent"
import { prisma } from "@/lib/prisma"
import { differenceInDays } from "date-fns"

export const getUserCurrentStreak = async (userId) => {
  try {
    const streak = await prisma.streak.findFirst({
      where: {
        userId: userId,
      },
      select: {
        currentStreak: true,
        lastCheckIn: true,
      },
    })
    if (!streak) {
      return { currentStreak: 0, streakEnded: false }
    }
    const daysSinceLastCheckIn = differenceInDays(
      new Date(),
      new Date(streak.lastCheckIn)
    )
    if (daysSinceLastCheckIn > 1) {
      return { currentStreak: 0, streakEnded: true }
    }
    return { currentStreak: streak.currentStreak, streakEnded: false }
  } catch (error) {
    throw new Error("Error fetching streak")
  }
}

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
        replies: {
          include: {
            user: {
              select: {
                name: true,
                profilePicture: true,
              },
            },
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
    const postUrl = `https://daily-check-in.com.ng/comment/${postId}`;

    // Only send email notification to the post owner, not the comment author
    if (postOwner.email && postOwner.id !== userId) {
      await sendEmailCommentNotification({
        to: postOwner.email,
        subject: "New Comment on Your Post",
        html: generateEmailHTML(postOwner.name, commentAuthor, content, postId),
      });
    }

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






export async function handleCreateReply(req, res) {
  const { content, userId, commentId } = req.body;

  try {
    const newReply = await prisma.reply.create({
      data: {
        content,
        userId,
        commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
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
        post: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (comment?.user?.email && comment.user.id !== userId) {
      const commentAuthor = comment.user.name;
      const commentAuthorEmail = comment.user.email;
      const postId = comment.post.id;

      let postAuthorName = "Unknown Author";
      if (typeof comment.post.user.name === "string") {
        postAuthorName = comment.post.user.name;
      } else if (
        typeof comment.post.user.name === "object" &&
        comment.post.user.name !== null
      ) {
        postAuthorName =
          comment.post.user.name.value ||
          comment.post.user.name.name ||
          comment.post.user.name.toString() ||
          "Unknown Author";
      }

      let displayContent = "";
      if (typeof comment.post.content === "string") {
        displayContent = comment.post.content;
      } else if (
        typeof comment.post.content === "object" &&
        comment.post.content !== null
      ) {
        displayContent =
          comment.post.content.text ||
          comment.post.content.content ||
          comment.post.content.toString() ||
          "Post content";
      } else {
        displayContent = "Post content";
      }

      const truncatedContent =
        displayContent.length > 100
          ? displayContent.substring(0, 50) + "..."
          : displayContent;

      // Send email notification to the comment owner
      await sendEmailCommentNotification({
        to: commentAuthorEmail,
        subject: "New Reply to Your Comment",
        html: generateReplyEmailHTML(
          commentAuthor,
          newReply.content,
          postId,
          truncatedContent,
          postAuthorName
        ),
      });
    }

    return res.status(201).json(newReply);
  } catch (error) {
    console.error("Error creating reply:", error);
    return res.status(500).json({ error: "Error creating reply" });
  }
}


export async function handleGetReplies(req, res) {
  const { commentId } = req.query
  try {
    const replies = await prisma.reply.findMany({
      where: {
        commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return res.status(200).json(replies)
  } catch (error) {
    return res.status(500).json({ error: "Error fetching replies" })
  }
}

export async function handleUpdateReply(req, res) {
  const { replyId } = req.query
  const { content } = req.body
  try {
    const updatedReply = await prisma.reply.update({
      where: {
        id: replyId,
      },
      data: {
        content,
      },
    })
    return res.status(200).json(updatedReply)
  } catch (error) {
    return res.status(500).json({ error: "Error updating reply" })
  }
}

export async function handleDeleteReply(req, res) {
  const { replyId } = req.query
  try {
    await prisma.reply.delete({
      where: {
        id: replyId,
      },
    })
    return res.status(204).end()
  } catch (error) {
    return res.status(500).json({ error: "Error deleting reply" })
  }
}


