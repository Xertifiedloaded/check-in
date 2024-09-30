const { prisma } = require("@/lib/prisma")

async function cleanupLikes() {
  const posts = await prisma.post.findMany()

  for (const post of posts) {
    const validLikes = post.likes.filter(like => {
      try {
        return typeof like === 'string' && like.length === 24 && /^[0-9a-fA-F]{24}$/.test(like)
      } catch {
        return false
      }
    })

    if (validLikes.length !== post.likes.length) {
      await prisma.post.update({
        where: { id: post.id },
        data: { likes: validLikes }
      })
      console.log(`Cleaned up likes for post ${post.id}`)
    }
  }

  console.log('Cleanup complete')
}

cleanupLikes()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())