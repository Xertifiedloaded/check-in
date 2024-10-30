import { PrismaClient } from '@prisma/client';
// node script.mjs
const prisma = new PrismaClient();
async function updatePostVisibility() {
  try {
    await prisma.post.updateMany({
      data: {
        visibility: "PUBLIC",
      },
    });

    console.log("All posts updated to PUBLIC visibility.");
  } catch (error) {
    console.error("Error updating post visibility:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePostVisibility();





