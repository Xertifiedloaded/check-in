
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function deleteUser(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log('User not found!');
      return;
    }
    await prisma.user.delete({
      where: { email: email }, 
    });

    console.log(`User with email ${email} has been deleted successfully.`);
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const emailToDelete = 'test@gmail.com'; 
deleteUser(emailToDelete);
