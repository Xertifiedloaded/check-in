

import databaseConnection from '@/lib/database';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'; 

export default async function handler(req, res) {
  await databaseConnection(); 

  if (req.method === 'POST') {
    const { resetToken, newPassword } = req.body; 
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Invalid request. Token and new password are required.' });
    }

    try {

      const user = await prisma.user.findFirst({
        where: {
          verificationToken: resetToken,
          verificationTokenExpiry: {
            gt: new Date() 
          }
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          verificationToken: null, 
          verificationTokenExpiry: null, 
        }
      });

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
