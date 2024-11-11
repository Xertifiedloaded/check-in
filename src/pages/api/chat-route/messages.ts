import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

const MESSAGES_PER_PAGE = 20;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId, otherUserId, page = '1' } = req.query;
    const pageNum = parseInt(page as string);

    if (!userId || !otherUserId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify current user is involved in the conversation
    if (session.user.id !== userId && session.user.id !== otherUserId) {
      return res.status(403).json({ error: 'Unauthorized access to conversation' });
    }

    // Find chat between users
    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { AND: [{ senderId: userId }, { receiverId: otherUserId }] },
          { AND: [{ senderId: otherUserId }, { receiverId: userId }] }
        ]
      }
    });

    if (!chat) {
      return res.json({
        messages: [],
        pagination: {
          page: pageNum,
          totalPages: 0,
          hasMore: false
        }
      });
    }

    const totalMessages = await prisma.message.count({
      where: { chatId: chat.id }
    });

    const totalPages = Math.ceil(totalMessages / MESSAGES_PER_PAGE);

    const messages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * MESSAGES_PER_PAGE,
      take: MESSAGES_PER_PAGE,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          }
        }
      }
    });

    return res.json({
      messages: messages.reverse(),
      pagination: {
        page: pageNum,
        totalPages,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

