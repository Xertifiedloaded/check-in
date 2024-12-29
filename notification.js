const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserNotifications() {
  try {
    await prisma.user.updateMany({
      where: {
        isDeleted: false, 
      },
      data: {
        notificationsEnabled: true, 
      },
    });

    await prisma.user.updateMany({
      where: {
        isDeleted: true, 
      },
      data: {
        notificationsEnabled: false, 
      },
    });

    console.log('User notifications updated successfully.');
  } catch (error) {
    console.error('Error updating user notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserNotifications();
