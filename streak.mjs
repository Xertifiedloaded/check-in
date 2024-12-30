// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function resetUserStreak(userId) {
//   try {
//     await prisma.streak.updateMany({
//       where: {
//         userId: userId,
//       },
//       data: {
//         currentStreak: 15, 
//         lastStreak: 15, 
//         isActive: true  
//       },
//     });
//     console.log(`Streak reset for user with ID ${userId}.`);
//   } catch (error) {
//     console.error("Error resetting user streak:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// resetUserStreak("66f91220a12d967d2b4126b9");



import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateLastStreakForAllUsers() {
  try {

    const users = await prisma.user.findMany({
      include: {
        streaks: true, 
      },
    });

    if (users.length === 0) {
      console.log("No users found.");
      return;
    }

    for (const user of users) {
      if (user.streaks.length > 0) {
        const streak = user.streaks[0]; 

        await prisma.streak.update({
          where: {
            id: streak.id, 
          },
          data: {
            lastStreak: streak.currentStreak, 
          },
        });

        console.log(`Updated lastStreak for user with ID ${user.id} to ${streak.currentStreak}`);
      }
    }
  } catch (error) {
    console.error("Error updating lastStreak:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function to update all users' lastStreak
updateLastStreakForAllUsers();
