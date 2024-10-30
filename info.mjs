import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUserName(userId, nameValue) {
  try {
    await prisma.user.update({
      where: {
        id: userId,  
      },
      data: {
        name: nameValue, 
      },
    });
    console.log(`Name updated to ${nameValue} for user with ID ${userId}.`);
  } catch (error) {
    console.error("Error updating user name:", error);
  } finally {
    await prisma.$disconnect();
  }
}


updateUserName("6720aad61b22265efc9d51ca", "FAVOUR AKINOLA");
