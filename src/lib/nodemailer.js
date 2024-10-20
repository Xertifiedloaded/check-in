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
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; padding: 20px 0;">
          <img src="https://www.daily-check-in.com.ng/check.svg" alt="Company Logo" style="max-width: 150px;"/>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 5px;">
          <h2 style="color: #333;">OTP Verification Code</h2>
          <p style="color: #555; font-size: 16px;">To complete your verification, use the following OTP code:</p>
          <p style="font-size: 24px; font-weight: bold; color: #000;">${otp}</p>
        </div>
        <div style="padding: 20px 0; text-align: center;">
          <p style="font-size: 14px; color: #777;">If you didn't request this, you can ignore this email.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #aaa;">
          <p>&copy; 2024 Daily checkin. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

{/* <a href=${verificationLink}>Verification link</a> */}
export const NotificationOption = {
  to: "horllypizzy@gmail.com",
  subject: "Automated Email Update",
  text: "This is your automated email update.",
  html: "<h1>Automated Update</h1><p>This is your automated email update.</p>",
}

