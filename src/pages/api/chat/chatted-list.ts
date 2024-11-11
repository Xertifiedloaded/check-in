
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        lastMessage: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const userChats = chats.map((chat) => {
      const otherUser = chat.senderId === session.user.id ? chat.receiver : chat.sender;
      return {
        id: chat.id,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        otherUser
      };
    });

    return res.status(200).json(userChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
