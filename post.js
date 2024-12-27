
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteLastPost() {
    try {

        const lastPost = await prisma.post.findFirst({
            orderBy: {
                createdAt: 'desc', 
            },
        });

        if (!lastPost) {
            console.log('No posts found to delete.');
            return;
        }

        console.log(`Deleting the last post with ID: ${lastPost.id}`);

        await prisma.post.delete({
            where: {
                id: lastPost.id,
            },
        });

        console.log('Last post deleted successfully.');
    } catch (error) {
        console.error('Error deleting the post:', error);
    } finally {
        await prisma.$disconnect();
    }
}


deleteLastPost();
