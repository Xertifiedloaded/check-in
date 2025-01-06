import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const streak = await prisma.streak.findFirst({
        where: { userId: session?.user?.id },
      });

      if (!streak) {
        return res.status(404).json({ 
          message: "Streak not found for the current user",
          streak: null || 0
        });
      }

      return res.status(200).json({ streak });
    } catch (error) {
      console.error("Error fetching streak:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { restoreStreakRequested } = req.body;

      let streak = await prisma.streak.findFirst({
        where: { userId: session.user.id },
      });

      if (!streak) {
        return res
          .status(404)
          .json({ message: "Streak not found for the current user" });
      }

      const currentDate = new Date();

      let newStreak;
      if (restoreStreakRequested) {
        newStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: streak.lastStreak,
            lastCheckIn: currentDate,
          },
        });
      } else {
        newStreak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            lastCheckIn: currentDate,
          },
        });
      }

      return res.status(200).json({
        message: restoreStreakRequested
          ? "Streak restored successfully"
          : "Streak updated successfully",
        updatedStreak: newStreak,
      });
    } catch (error) {
      console.error("Error updating streak:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }

  // Handle any other HTTP method
  return res.status(405).json({ message: "Method not allowed" });
}