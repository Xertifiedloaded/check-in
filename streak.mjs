import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUserStreak(userId, newStreakValue) {
  try {
    await prisma.streak.updateMany({
      where: {
        userId: userId,  
      },
      data: {
        currentStreak: newStreakValue,  
      },
    });
    console.log(`Streak updated to ${newStreakValue} for user with ID ${userId}.`);
  } catch (error) {
    console.error("Error updating user streak:", error);
  } finally {
    await prisma.$disconnect();
  }
}
updateUserStreak("66f91220a12d967d2b4126b9", 0);
