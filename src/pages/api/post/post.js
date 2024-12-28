

import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import formidable from 'formidable';
import { uploadToStorage } from '../../../lib/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, 
      keepExtensions: true,
      multiples: false,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const content = fields.content?.[0] || fields.content; 
    const visibility = fields.visibility?.[0] || fields.visibility || "PUBLIC";
    const imageFile = files.image?.[0] || files.image; 

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: "Check-in message is required" });
    }

    const currentDate = new Date();

    let streak = await prisma.streak.findFirst({
      where: { userId: session.user.id },
    });

    let streakUpdated = false;
    let newStreak = null;

    if (!streak) {
      newStreak = await prisma.streak.create({
        data: {
          userId: session.user.id,
          startDate: currentDate,
          currentStreak: 1,
          lastCheckIn: currentDate,
          lastStreak: 0,
        },
      });
      streakUpdated = true;
    } else {
      if (isConsecutiveDay(streak.lastCheckIn, currentDate)) {
        newStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: streak.currentStreak + 1,
            lastCheckIn: currentDate,
          },
        });
        streakUpdated = true;
      } else if (isSameDay(streak.lastCheckIn, currentDate)) {
        newStreak = streak;
      } else {
        newStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            lastStreak: streak.currentStreak, 
            lastCheckIn: currentDate,
            currentStreak: 1, 
          },
        });
        streakUpdated = true;
      }
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(imageFile.mimetype)) {
          return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
        }

        imageUrl = await uploadToStorage(imageFile);
      } catch (error) {
        console.error("Image upload failed:", error);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const checkIn = await prisma.post.create({
      data: {
        content: content.trim(),
        imageUrl,
        visibility,
        createdAt: new Date(),
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    const todayCheckIns = await prisma.post.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    return res.status(201).json({
      message: "Check-in posted successfully",
      checkIn,
      updatedStreak: newStreak ? newStreak.currentStreak : 0,
      lastStreak: newStreak?.lastStreak || 0,
      streakUpdated,
      todayCheckInsCount: todayCheckIns,
    });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

function isConsecutiveDay(date1, date2) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const differenceInDays = Math.round((date2 - date1) / oneDayInMilliseconds);
  return differenceInDays === 1;
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}





// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const session = await getServerSession(req, res, authOptions);
//     if (!session?.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const form = formidable({
//       maxFileSize: 10 * 1024 * 1024, 
//       keepExtensions: true,
//       multiples: false,
//     });

//     const [fields, files] = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         resolve([fields, files]);
//       });
//     });


//     const content = fields.content?.[0] || fields.content; 
//     const visibility = fields.visibility?.[0] || fields.visibility || "PUBLIC";
//     const imageFile = files.image?.[0] || files.image; 

//     if (!content || typeof content !== 'string' || !content.trim()) {
//       return res.status(400).json({ message: "Check-in message is required" });
//     }

//     const currentDate = new Date();
//     const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
//     const todayEnd = new Date(currentDate.setHours(23, 59, 59, 999));

//     let streak = await prisma.streak.findFirst({
//       where: { userId: session.user.id },
//     });

//     let streakUpdated = false;
//     let newStreak = null;

//     if (!streak) {
//       newStreak = await prisma.streak.create({
//         data: {
//           userId: session.user.id,
//           startDate: currentDate,
//           currentStreak: 1,
//           lastCheckIn: currentDate,
          
//         },
//       });
//       streakUpdated = true;
//     } else {
//       if (isConsecutiveDay(streak.lastCheckIn, currentDate)) {
//         newStreak = await prisma.streak.update({
//           where: { id: streak.id },
//           data: {
//             currentStreak: streak.currentStreak + 1,
//             lastCheckIn: currentDate,
//           },
//         });
//         streakUpdated = true;
//       } else if (isSameDay(streak.lastCheckIn, currentDate)) {
//         newStreak = streak;
//       } else {
//         newStreak = await prisma.streak.update({
//           where: { id: streak.id },
//           data: {
//             lastCheckIn: currentDate,
//             currentStreak: 1,
//           },
//         });
//         streakUpdated = true;
//       }
//     }


//     let imageUrl = null;
//     if (imageFile) {
//       try {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//         if (!allowedTypes.includes(imageFile.mimetype)) {
//           return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
//         }

//         imageUrl = await uploadToStorage(imageFile);
//       } catch (error) {
//         console.error("Image upload failed:", error);
//         return res.status(500).json({ message: "Failed to upload image" });
//       }
//     }

//     const checkIn = await prisma.post.create({
//       data: {
//         content: content.trim(),
//         imageUrl,
//         visibility,
//         createdAt: new Date(),
//         userId: session.user.id,
//       },
//       include: {
//         user: {
//           select: {
//             name: true,
//             profilePicture: true,
//           },
//         },
//       },
//     });

//     const todayCheckIns = await prisma.post.count({
//       where: {
//         userId: session.user.id,
//         createdAt: {
//           gte: todayStart,
//           lte: todayEnd,
//         },
//       },
//     });

//     return res.status(201).json({
//       message: "Check-in posted successfully",
//       checkIn,
//       updatedStreak: newStreak ? newStreak.currentStreak : 0,
//       streakUpdated,
//       todayCheckInsCount: todayCheckIns,
//     });

//   } catch (error) {
//     console.error("Error creating check-in:", error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// }

// function isConsecutiveDay(date1, date2) {
//   const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
//   const differenceInDays = Math.round((date2 - date1) / oneDayInMilliseconds);
//   return differenceInDays === 1;
// }

// function isSameDay(date1, date2) {
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   );
// }