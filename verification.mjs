import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function verifyUser(userId) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,  
      },
      data: {
        isVerified: true, 
        lastSeen: new Date(),
      },
    });
    console.log(`User with ID ${userId} is now verified.`);
    return user;
  } catch (error) {
    console.error("Error verifying user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser("6722988ec3766b7115d43a54");
