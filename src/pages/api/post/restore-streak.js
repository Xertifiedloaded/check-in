import { prisma } from "../../../lib/prisma";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;  

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const currentDate = new Date();

      const streak = await prisma.streak.findUnique({
        where: { userId },
      });

      if (!streak) {
        return res.status(404).json({ error: "Streak not found for this user." });
      }

      const lastCheckInDate = new Date(streak.lastCheckIn);
      const timeDifference = currentDate - lastCheckInDate;
      if (timeDifference <= 24 * 60 * 60 * 1000) {
        const updatedStreak = await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: streak.currentStreak, 
            lastCheckIn: currentDate, 
          },
        });

        return res.status(200).json({
          message: "Streak restored successfully.",
          streak: updatedStreak,
        });
      } else {
        return res.status(400).json({ error: "Streak cannot be restored. It has been over 24 hours." });
      }
    } catch (error) {
      console.error("Error restoring streak: ", error);
      res.status(500).json({ error: "An error occurred while restoring the streak." });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
