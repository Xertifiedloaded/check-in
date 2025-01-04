require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUsersWhoHaventPosted() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const todayDate = today.toISOString().split('T')[0];
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true, 
        isDeleted: false,
      },
      include: {
        streaks: true, 
      },
    });

    const usersToNotify = users.filter(user => {
      const lastStreak = user.streaks.reduce((latest, streak) => {
        if (!latest || (streak.lastCheckIn && streak.lastCheckIn > latest.lastCheckIn)) {
          return streak;
        }
        return latest;
      }, null);

      if (lastStreak && lastStreak.lastCheckIn) {
        // Compare the date only (ignoring time)
        const lastCheckInDate = new Date(lastStreak.lastCheckIn).toISOString().split('T')[0];
        return lastCheckInDate !== todayDate; // Only notify if last check-in is not today
      }

      return true; // No streaks found, notify user by default
    });

    if (usersToNotify.length > 0) {
      console.log(`Found ${usersToNotify.length} users who haven't posted today and have notifications enabled.`);
      usersToNotify.forEach(user => console.log(user.name)); // Display only the names of the users
    } else {
      console.log("No users found who haven't posted today with notifications enabled.");
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getUsersWhoHaventPosted();


// require('dotenv').config();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function getAllUsers() {
//   try {
//     const users = await prisma.user.findMany();

//     if (users.length > 0) {
//       console.log(`Found ${users.length} users.`);
//       users.forEach(user => console.log(`Name: ${user.name}, Email: ${user.email}, NotificationsEnabled: ${user.notificationsEnabled}`)); 
//     } else {
//       console.log("No users found.");
//     }
//   } catch (error) {
//     console.error("Error fetching users:", error.message);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// getAllUsers();
