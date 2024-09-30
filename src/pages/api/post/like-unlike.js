import { prisma } from '@/lib/prisma';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;

  const userId = method === 'GET' ? req.query.userId : req.body.userId;
  const postId = method === 'GET' ? req.query.postId : req.body.postId;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid userId or postId' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (method === 'GET') {
      const hasLiked = post.likes.includes(userId);
      const likeCount = post.likes.length; 
      return res.status(200).json({ liked: hasLiked, likeCount });
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
  }
}
