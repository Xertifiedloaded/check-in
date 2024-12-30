import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/authOptions";


export async function updateStreaksMiddleware() {
  try {
    const streaks = await prisma.streak.findMany({
      where: {
        isActive: true,
      },
    });

    for (const streak of streaks) {
      const lastCheckIn = new Date(streak.lastCheckIn);
      const currentDate = new Date();
      const timeDifference = currentDate - lastCheckIn;

      if (timeDifference > 24 * 60 * 60 * 1000) {
        await prisma.streak.update({
          where: { id: streak.id },
          data: {
            lastStreak: streak.currentStreak,
            currentStreak: 0,
            isActive: false,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error updating streaks:", error);
  }
}


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const userId = session.user.id;

  if (req.method === "GET") {
    try {
      const streak = await prisma.streak.findFirst({
        where: { userId },
      });

      if (!streak) {
        return res.status(404).json({ error: "Streak not found for this user." });
      }

      return res.status(200).json(streak);
    } catch (error) {
      console.error("Error fetching streak: ", error);
      return res.status(500).json({ error: "An error occurred while fetching the streak." });
    }
  } else if (req.method === "POST") {
    try {
      const { restoreStreak } = req.body; 
      const currentDate = new Date();
      let streak = await prisma.streak.findFirst({
        where: { userId },
      });

      if (!streak) {
        streak = await prisma.streak.create({
          data: {
            userId,
            startDate: currentDate,
            currentStreak: 1,
            lastCheckIn: currentDate,
            isActive: true,
          },
        });

        return res.status(201).json({
          message: "New streak created.",
          streak,
        });
      }

      if (restoreStreak && streak.lastStreak > 0 && !streak.isActive) {
        console.log("Restoring streak...", { lastStreak: streak.lastStreak, currentStreak: streak.currentStreak });
        const updatedStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: streak.lastStreak, 
            lastCheckIn: currentDate,
            isActive: true,
          },
        });
      
        console.log("Streak restored:", updatedStreak);
        
        return res.status(200).json({
          message: "Streak restored successfully.",
          streak: updatedStreak,
        });
      }
      


      const lastCheckInDate = streak.lastCheckIn ? new Date(streak.lastCheckIn) : null;
      
      if (!lastCheckInDate || (currentDate - lastCheckInDate <= 24 * 60 * 60 * 1000)) {
        const updatedStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: streak.currentStreak + 1,
            lastCheckIn: currentDate,
            isActive: true,
          },
        });

        return res.status(200).json({
          message: "Streak updated successfully.",
          streak: updatedStreak,
        });
      } else {
        return res.status(400).json({
          error: "Streak cannot be updated. It has been over 24 hours since the last check-in.",
        });
      }
    } catch (error) {
      console.error("Error updating streak: ", error);
      return res.status(500).json({ error: "An error occurred while updating the streak." });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}