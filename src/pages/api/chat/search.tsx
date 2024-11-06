
// import { prisma } from '@/lib/prisma';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const session = await getSession({ req });
//   if (!session?.user) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const { q } = req.query;
  
//   try {
//     const users = await prisma.user.findMany({
//       where: {
//         AND: [
//           { name: { contains: q as string, mode: 'insensitive' } },
//           { id: { not: session.user.id } }, 
//         ],
//       },
//       select: {
//         id: true,
//         name: true,
//         profilePicture: true,
//       },

//     });

//     return res.status(200).json(users);
//   } catch (error) {
//     console.error('Error searching users:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }




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
  
  // Check if `q` is provided
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { name: { contains: q, mode: 'insensitive' } },
          { id: { not: session.user.id } },
        ],
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
