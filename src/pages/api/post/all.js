// import { prisma } from "../../../lib/prisma";


// export default async function handler(req, res) {
//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         visibility: {
//           in: ["PUBLIC", "public"],
//         }
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             username: true,
//             isVerified: true,
//             isOwner: true,
//             profilePicture: true,
//             streaks: {
//               select: {
//                 currentStreak: true,
//               },
//             },
//           },
//         },
//         comments: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 profilePicture: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const postsMap = new Map();

//     for (const post of posts) {
//       const userId = post.userId;
//       const currentStreak =
//         post.user.streaks.length > 0 ? post.user.streaks[0].currentStreak : 0;

//       const postData = {
//         ...post,
//         likeCount: post.likes.length,
//         content: post.content,
//         commentCount: post.comments.length,
//         currentStreak,
//       };

//       if (!postsMap.has(userId) || post.createdAt > postsMap.get(userId).createdAt) {
//         postsMap.set(userId, postData);
//       }
//     }

//     const allPosts = Array.from(postsMap.values());

//     res.status(200).json({ posts: allPosts });
//   } catch (error) {
//     console.error("Error fetching posts: ", error);
//     res.status(500).json({ error: "An error occurred while fetching posts." });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


import { prisma } from "../../../lib/prisma";
import cors from 'cors';

const corsHandler = cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
});

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    corsHandler(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        visibility: {
          in: ["PUBLIC", "public"],
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            isVerified: true,
            isOwner: true,
            profilePicture: true,
            streaks: {
              select: {
                currentStreak: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const postsMap = new Map();

    for (const post of posts) {
      const userId = post.userId;
      const currentStreak = 
        post.user.streaks.length > 0 ? post.user.streaks[0].currentStreak : 0;

      const postData = {
        ...post,
        likeCount: post.likes.length,
        content: post.content,
        commentCount: post.comments.length,
        currentStreak,
      };

      if (!postsMap.has(userId) || post.createdAt > postsMap.get(userId).createdAt) {
        postsMap.set(userId, postData);
      }
    }

    const allPosts = Array.from(postsMap.values());

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.error("Error fetching posts: ", error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  } finally {
    await prisma.$disconnect();
  }
}