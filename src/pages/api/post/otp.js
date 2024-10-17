import databaseConnection from "@/lib/database";
import { prisma } from "@/lib/prisma";


export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === 'POST') {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }
    try {
      const user = await prisma.user.findFirst({
        where: { otp }
      });
      if (!user) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      if (new Date() > user.otpExpiry) {
        return res.status(400).json({ message: 'OTP expired' });
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otp: null,   
          otpExpiry: null, 
        }
      });

      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
