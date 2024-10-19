import jwt from "jsonwebtoken"
import { generateOTP } from "@/lib/Otp"
import databaseConnection from "@/lib/database"
import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/nodemailer"
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  await databaseConnection()
  // Check verification status immediately i verify user because session on frontend will not work
  if (req.method === 'GET') {
    try {
      const session = await getSession({ req })
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email
        },
        select: {
          isVerified: true
        }
      })
      return res.status(200).json({ isVerified: user?.isVerified || false })
    } catch (error) {
      console.error('Error checking verification status:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }


  if (req.method === 'POST') {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const otp = generateOTP(4)
      const OTPverificationToken = jwt.sign({ otp }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      })

      const verificationLink = `https://check-in-psi.vercel.app/verify/auth/${OTPverificationToken}`
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) 

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
          otpExpiry,
        },
      })

      await sendOtpEmail(user.email, otp, verificationLink)

      return res.status(200).json({
        message: "Verification email sent successfully",
        data: {
          verificationLink,
          isVerified: false,
        },
      })
    } catch (error) {
      console.error('Error sending verification email:', error)
      return res.status(500).json({ message: "Server error" })
    }
  }
  return res.status(405).json({ message: "Method not allowed" })
}