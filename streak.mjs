// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function resetUserStreak(userId) {
//   try {
//     let streak = await prisma.streak.findFirst({
//       where: { userId: userId },
//     });

//     if (!streak) {
//       streak = await prisma.streak.create({
//         data: {
//           userId: userId,
//           startDate: new Date(),
//           currentStreak: 86, 
//           lastCheckIn: new Date(),
//           isActive: true,
//         },
//       });
//       console.log(`No streak found. A new streak has been created for user with ID ${userId}.`);
//     } else {
//       streak = await prisma.streak.update({
//         where: { id: streak.id },
//         data: {
//           currentStreak: 87, 
//         },
//       });
//       console.log(`Streak updated for user with ID ${userId}.`);
//     }

//     console.log("Final streak:", streak);
//   } catch (error) {
//     console.error("Error resetting user streak:", error.message);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// resetUserStreak("670b89c78cecb168cf3dbcc4");



import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateLastStreak(userId) {
  try {
    // Find the streak for the user based on the `userId`
    const streak = await prisma.streak.findFirst({
      where: { userId: userId },
    });

    if (!streak) {
      console.log("Streak not found for user with ID:", userId);
      return;
    }

    // Update the lastStreak to 10
    const updatedStreak = await prisma.streak.update({
      where: { id: streak.id }, // Use the `id` here to uniquely identify the record
      data: {
        currentStreak: 0,
      },
    });

    console.log(`Successfully updated lastStreak for user ${userId}:`, updatedStreak);
  } catch (error) {
    console.error("Error updating lastStreak:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Replace 'your-user-id' with the actual userId you want to test with
const userId = '67764a92f46fe0a630f3d82c'; 
updateLastStreak(userId);
