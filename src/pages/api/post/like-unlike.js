

import { authOptions } from '../../../lib/authOptions';
import { prisma } from '../../../lib/prisma';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { postId } = req.query;

    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const likeCount = post.likes.length;

      let hasLiked = false;
      const session = await getServerSession(req, res, authOptions);

      if (session && session.user && session.user.id) {
        hasLiked = post.likes.includes(session.user.id);
      }

      return res.status(200).json({ liked: hasLiked, likeCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'You must be logged in to like/unlike posts.' });
  }

  const userId = session.user.id;
  const postId = req.body.postId;

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid postId' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (method === 'POST') {
      const hasLiked = post.likes.includes(userId);
      const updatedLikes = hasLiked
        ? post.likes.filter((id) => id !== userId)
        : [...post.likes, userId];

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likes: updatedLikes },
      });

      const likeUnlikeMessage = hasLiked ? 'Post unliked' : 'Post liked';
      const likeCount = updatedPost.likes.length;

      return res.status(200).json({ message: likeUnlikeMessage, likeCount });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while processing the request' });
  }finally {
    await prisma.$disconnect();
  }
}
