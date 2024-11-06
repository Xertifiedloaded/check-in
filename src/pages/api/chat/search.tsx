
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { q } = req.query;
  
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { id: { not: session.user.id } }, 
        ],
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
      },
      take: 10,
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}