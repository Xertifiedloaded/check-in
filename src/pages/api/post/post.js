
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

function getDayBounds(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return { startOfDay, endOfDay };
}

function isConsecutiveDay(previousDate, currentDate) {
  const prev = new Date(previousDate);
  prev.setHours(0, 0, 0, 0);
  
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - prev.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays === 1;
}

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
    const { startOfDay, endOfDay } = getDayBounds(currentDate);

    const todayCheckIns = await prisma.post.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let streak = await prisma.streak.findFirst({
      where: { userId: session.user.id },
    });

    let streakUpdated = false;
    let newStreak = null;

    if (!streak) {
      // First time user, create new streak
      newStreak = await prisma.streak.create({
        data: {
          userId: session?.user?.id,
          startDate: currentDate,
          currentStreak: 1,
          lastCheckIn: currentDate,
          lastStreak: 0,
          isActive: true,
        },
      });
      streakUpdated = true;
    } else {
      const lastCheckIn = new Date(streak.lastCheckIn);
      
      if (isSameDay(lastCheckIn, currentDate)) {
        // Already checked in today, maintain current streak
        newStreak = streak;
      } else if (isConsecutiveDay(lastCheckIn, currentDate)) {
        newStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: streak.currentStreak + 1,
            lastCheckIn: currentDate,
            isActive: true,
          },
        });
        streakUpdated = true;
      } else {
        // Missed a day, reset streak
        newStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            lastStreak: streak.currentStreak,
            currentStreak: 1,
            lastCheckIn: currentDate,
            isActive: true,
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
        createdAt: currentDate,
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

    return res.status(201).json({
      message: "Check-in posted successfully",
      checkIn,
      updatedStreak: newStreak.currentStreak,
      lastStreak: newStreak.lastStreak,
      streakUpdated,
      todayCheckInsCount: todayCheckIns + 1,
    });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

function isSameDay(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}










// import { authOptions } from "../../../lib/authOptions";
// import { prisma } from "../../../lib/prisma";
// import { getServerSession } from "next-auth";
// import formidable from 'formidable';
// import { uploadToStorage } from '../../../lib/storage';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// function getDayBounds(date) {
//   const startOfDay = new Date(date);
//   startOfDay.setHours(0, 0, 0, 0);
  
//   const endOfDay = new Date(date);
//   endOfDay.setHours(23, 59, 59, 999);
  
//   return { startOfDay, endOfDay };
// }

// function isWithin24Hours(date1, date2) {
//   const hoursDifference = Math.abs(date2 - date1) / (1000 * 60 * 60);
//   return hoursDifference <= 24;
// }

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
//     const { startOfDay, endOfDay } = getDayBounds(currentDate);

//     // Check for existing check-ins today
//     const todayCheckIns = await prisma.post.count({
//       where: {
//         userId: session.user.id,
//         createdAt: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//     });

//     let streak = await prisma.streak.findFirst({
//       where: { userId: session.user.id },
//     });

//     let streakUpdated = false;
//     let newStreak = null;

//     if (!streak) {
//       newStreak = await prisma.streak.create({
//         data: {
//           userId: session?.user?.id,
//           startDate: currentDate,
//           currentStreak: 1,
//           lastCheckIn: currentDate,
//           lastStreak: 0, 
//           isActive: true,
//         },
//       });
//       streakUpdated = true;
//     } else {
//       const lastCheckIn = new Date(streak.lastCheckIn);
    
//       if (isWithin24Hours(lastCheckIn, currentDate)) {
//         if (!isSameDay(lastCheckIn, currentDate)) {
//           newStreak = await prisma.streak.update({
//             where: { id: streak.id },
//             data: {
//               currentStreak: streak.currentStreak + 1,
//               lastCheckIn: currentDate,
//               isActive: true,
//             },
//           });
//           streakUpdated = true;
//         } else {
//           newStreak = streak;
//         }
//       } else {
//         newStreak = await prisma.streak.update({
//           where: { id: streak.id },
//           data: {
//             lastStreak: streak.currentStreak, 
//             currentStreak: 1, 
//             lastCheckIn: currentDate,
//             isActive: true, 
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
//         createdAt: currentDate,
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

//     return res.status(201).json({
//       message: "Check-in posted successfully",
//       checkIn,
//       updatedStreak: newStreak.currentStreak,
//       lastStreak: newStreak.lastStreak,
//       streakUpdated,
//       todayCheckInsCount: todayCheckIns + 1,
//     });
//   } catch (error) {
//     console.error("Error creating check-in:", error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// }

// function isSameDay(date1, date2) {
//   date1 = new Date(date1);
//   date2 = new Date(date2);
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   );
// }




