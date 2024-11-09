import { prisma } from "../lib/prisma";


export async function handleGetProfile(userId, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        isOwner:true,
        phoneNumber:true,
        isVerified: true,
        username: true,
        createdAt: true,
        posts: {
          where: {
            visibility: {
              in: ['PUBLIC', 'PRIVATE'],
            },
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            visibility: true,
            createdAt: true,
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
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
        success: false,
        message: "User not found",
      });
    }

    const publicPosts = user.posts.filter((post) => post.visibility === 'PUBLIC');
    const privatePosts = user.posts.filter((post) => post.visibility === 'PRIVATE');

    const transformedData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isOwner: user.isOwner,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture || "/no-user.png",
      isVerified: user.isVerified,
      currentStreak: user.streaks[0]?.currentStreak || 0,
      lastCheckIn: user.streaks[0]?.lastCheckIn || null,
      totalPosts: user._count.posts,
      memberSince: user.createdAt,
      publicPosts: publicPosts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        commentCount: post._count.comments,
        comments: post.comments,
      })),
      privatePosts: privatePosts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        commentCount: post._count.comments,
        comments: post.comments,
      })),
    };

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );

    return res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile data",
      error: error.message,
    });
  }finally {
    await prisma.$disconnect();
  }
}





export async function handleUpdateProfile(updateData, res) {
  const { userId, ...updateFields } = updateData;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const validUpdateFields = Object.entries(updateFields).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validUpdateFields,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        isVerified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }finally {
    await prisma.$disconnect();
  }
}

export async function handleDeleteProfilePicture(userId, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: null },
      select: {
        id: true,
        profilePicture: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile picture deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete profile picture.",
      error: error.message,
    });
  }finally {
    await prisma.$disconnect();
  }
}
