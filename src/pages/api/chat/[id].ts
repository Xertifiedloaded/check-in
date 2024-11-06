import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    const friendship = await prisma.friendship.update({
      where: {
        id: id as string,
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    return res.status(200).json(friendship);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}