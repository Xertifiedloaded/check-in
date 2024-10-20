import nodemailer from "nodemailer"
import { createEmailContent } from "./emailContent"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendOtpEmail = async (userEmail, otp, verificationLink) => {
  await transporter.sendMail({
    to: userEmail,
    subject: "Your OTP Verification Code",
    html: `<p>Your OTP code is: <strong>${otp}</strong> <a href=${verificationLink}>Verification link</a></p>`,
  })
}

export const NotificationOption = {
  to: "horllypizzy@gmail.com",
  subject: "Automated Email Update",
  text: "This is your automated email update.",
  html: "<h1>Automated Update</h1><p>This is your automated email update.</p>",
}

