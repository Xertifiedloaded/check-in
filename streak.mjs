import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetUserStreak(userId) {
  try {
    await prisma.streak.updateMany({
      where: {
        userId: userId,
      },
      data: {
        currentStreak: 0, // Reset the current streak
        lastStreak: 15, 
        isActive: true   // Reset the last streak
      },
    });
    console.log(`Streak reset for user with ID ${userId}.`);
  } catch (error) {
    console.error("Error resetting user streak:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserStreak("66f91220a12d967d2b4126b9");