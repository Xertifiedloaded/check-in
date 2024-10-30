import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setUserAsOwner(userId) {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isOwner: true,
      },
    });
    console.log(`User with ID ${userId} is now set as owner (isOwner: true).`);
  } catch (error) {
    console.error("Error setting user as owner:", error);
  } finally {
    await prisma.$disconnect();
  }
}


setUserAsOwner("670a67c36794978e92c316ca");
