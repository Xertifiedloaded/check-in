import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function updatePostVisibility() {
  try {
    await prisma.post.updateMany({
      data: {
        visibility: "PUBLIC",
      },
    });

  } catch (error) {
    console.error("Error updating post visibility:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePostVisibility();





