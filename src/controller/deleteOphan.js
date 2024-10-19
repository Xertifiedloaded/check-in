import { prisma } from "@/lib/prisma"
async function cleanupOrphanedData() {
  try {

    await prisma.post.deleteMany({
      where: {
        user: null
      }
    })

    await prisma.comment.deleteMany({
      where: {
        user: null
      }
    })

    await prisma.reply.deleteMany({
      where: {
        user: null
      }
    })
    await prisma.streak.deleteMany({
      where: {
        user: null
      }
    })



    console.log('Cleanup completed successfully')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupOrphanedData()