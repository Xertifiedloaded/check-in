
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


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

  const { userId, isOnline } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating online status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}