
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'
interface FriendRequest {
  id: string;
  userId: string;
  friendId: string;
  status: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { requestId } = req.query;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'You need to be logged in' });
  }

  const userId = session.user.id;

  try {
    const friendRequest: FriendRequest | null = await prisma.friendship.findUnique({
      where: { id: requestId as string },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.friendId !== userId) {
      return res.status(403).json({ message: 'You cannot accept this request' });
    }

    await prisma.friendship.update({
      where: { id: requestId as string },
      data: { status: 'ACCEPTED' },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { friends: { connect: { id: friendRequest.userId } } },
    });

    await prisma.user.update({
      where: { id: friendRequest.userId },
      data: { friends: { connect: { id: userId } } },
    });

    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
