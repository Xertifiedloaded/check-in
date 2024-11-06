import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { content, visibility = "PUBLIC" } = req.body; 
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;
    if (!content) {
      return res.status(400).json({ message: "Check-in message is required" });
    }

    try {
      const currentDate = new Date();
      const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
      const todayEnd = new Date(currentDate.setHours(23, 59, 59, 999));

      let streak = await prisma.streak.findFirst({
        where: { userId },
      });

      let streakUpdated = false;
      let newStreak = null;

      if (!streak) {
        newStreak = await prisma.streak.create({
          data: {
            userId,
            startDate: currentDate,
            currentStreak: 1,
            lastCheckIn: currentDate,
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
              lastCheckIn: currentDate,
              currentStreak: 1,
            },
          });
          streakUpdated = true;
        }
      }

      const checkIn = await prisma.post.create({
        data: {
          content,
          userId,
          visibility, 
        },
      });

      const todayCheckIns = await prisma.post.count({
        where: {
          userId,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      return res.status(201).json({
        message: "Check-in posted successfully",
        checkIn,
        updatedStreak: newStreak ? newStreak.currentStreak : 0,
        streakUpdated,
        todayCheckInsCount: todayCheckIns,
      });
    } catch (error) {
      console.error("Error creating check-in:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
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
