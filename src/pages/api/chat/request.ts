import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'POST') {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    try {
      const existingRequest = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });

      if (existingRequest) {
        return res.status(400).json({
          error: 'Friend request already exists or users are already friends',
        });
      }

      const friendRequest = await prisma.friendship.create({
        data: {
          userId: userId,
          friendId: friendId,
          status: 'PENDING',
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

      return res.status(201).json(friendRequest);
    } catch (error) {
      console.error('Error creating friend request:', error);
      return res.status(500).json({ error: 'Error creating friend request' });
    }
  }

  if (req.method === 'GET') {
    try {
      const friendRequests = await prisma.friendship.findMany({
        where: {
          friendId: userId,
          status: 'PENDING',
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

      return res.status(200).json(friendRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      return res.status(500).json({ error: 'Error fetching friend requests' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
