
import databaseConnection from "@/lib/database";
import { generateOTP } from "@/lib/Otp";

import { prisma } from "@/lib/prisma";


export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newOtp = generateOTP(4);
      const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); 

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: newOtp,
          otpExpiry: otpExpiry,
        },
      });
      res.status(200).json({
        message: "OTP resent successfully",
        otp: newOtp, 
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
