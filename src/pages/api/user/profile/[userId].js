import { prisma } from "../../../../lib/prisma";



export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', allowedMethods: ['GET'] });
  }

  const { userId } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        isVerified: true,
        username: true,
        createdAt: true,
        posts: {
          where: {
            visibility: 'PUBLIC', 
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            id: true,
            content: true,
            createdAt: true,
            comments: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    profilePicture: true,
                  },
                },
              },
            },
            _count: {
              select: {
                comments: true,
  
              },
            },
          },
        },
        streaks: {
          select: {
            currentStreak: true,
            lastCheckIn: true,
            startDate: true,
          },
          take: 1,
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user profile does not exist',
      });
    }

    console.log('Fetched user:', JSON.stringify(user, null, 2));

    const transformedData = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture || '/no-user.png',
      isVerified: user.isVerified,
      currentStreak: user.streaks[0]?.currentStreak || 0,
      lastCheckIn: user.streaks[0]?.lastCheckIn || null,
      totalPosts: user._count.posts,
      memberSince: user.createdAt,
      recentPosts: (user.posts || []).map(post => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        commentCount: post._count.comments,
        likeCount: post._count.likes, 
        comments: post.comments,
      })),
    };

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    );

    return res.status(200).json({
      success: true,
      data: transformedData,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching the profile data',
    });
  }finally {
    await prisma.$disconnect();
  }
}
