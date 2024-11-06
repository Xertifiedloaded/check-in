
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
    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { userId: userId, status: 'ACCEPTED' },
            { friendId: userId, status: 'ACCEPTED' },
          ],
        },
        include: {
          friend: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              isOnline: true,
              lastSeen: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              isOnline: true,
              lastSeen: true,
            },
          },
        },
      });

      const friends = friendships.map((friendship) => {
        const friend =
          friendship.userId === userId ? friendship.friend : friendship.user;
        return {
          id: friend.id,
          name: friend.name,
          profilePicture: friend.profilePicture,
          isOnline: friend.isOnline,
          lastSeen: friend.lastSeen,
        };
      });

      return res.status(200).json(friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { friendId } = req.body;

    try {
      const friendship = await prisma.friendship.create({
        data: {
          userId: userId,
          friendId: friendId,
          status: 'PENDING',
        },
      });

      return res.status(201).json(friendship);
    } catch (error) {
      console.error('Error adding friend:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


