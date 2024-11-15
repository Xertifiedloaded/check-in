import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function updateStreak(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query; 
  const { currentStreak } = req.body; 

  if (!userId || currentStreak === undefined) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const updatedStreak = await prisma.streak.updateMany({
      where: {
        userId: userId,
      },
      data: {
        currentStreak: currentStreak,
      },
    });

    if (updatedStreak.count === 0) {
      return res.status(404).json({ message: "Streak not found for the user" });
    }

    console.log(
      `Streak updated to ${currentStreak} for user with ID ${userId}.`
    );

    return res.status(200).json({
      message: "Streak updated successfully",
      currentStreak,
    });
  } catch (error) {
    console.error("Error updating user streak:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
