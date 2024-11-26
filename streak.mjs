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
updateUserStreak("6713bb6a429cd2def28c955b", 36);
