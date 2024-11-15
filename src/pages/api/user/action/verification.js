import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function verificationHandler(req, res){
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
        const user = await prisma.user.update({
          where: {
            id: userId,  
          },
          data: {
            isVerified: true, 
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


