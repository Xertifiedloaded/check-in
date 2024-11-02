import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function updateLastSeen() {
  try {
    const updatedUsers = await prisma.user.updateMany({
      where: {
        lastSeen: null,
      },
      data: {
        lastSeen: new Date(), 
      },
    });

    console.log(`Updated  users with null lastSeen to the current date.`);
  } catch (error) {
    console.error("Error updating lastSeen:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLastSeen();