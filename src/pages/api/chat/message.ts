import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    const { friendId } = req.query;

    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: friendId as string },
            { senderId: friendId as string, receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Mark messages as read
      if (messages.length > 0) {
        await prisma.message.updateMany({
          where: {
            receiverId: userId,
            senderId: friendId as string,
            read: false,
          },
          data: {
            read: true,
          },
        });
      }

      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { content, receiverId } = req.body;

    try {
      const message = await prisma.message.create({
        data: {
          content,
          senderId: userId,
          receiverId,
        },
        include: {
          sender: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
        },
      });

      return res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}