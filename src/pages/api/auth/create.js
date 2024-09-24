import databaseConnection from "@/lib/database";
import {
  generateResetPasswordEmail,
  generateSignupOtpEmail,
} from "@/lib/generateOtpAndResetPasswordNotification";
import transporter from "@/lib/nodemailer";
import User from "@/model/User";
import { generateOTP } from "@/utils/Otp";
import Crypto from "crypto";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await databaseConnection();
  const otp = generateOTP(4);
  if (req.method === "POST") {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const OTPverificationToken = jwt.sign({ otp }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const verificationLink = `https://www.abg-funaab.com.ng/verify/auth/${OTPverificationToken}`;

      const newUser = await User.create({
        name,
        email,
        otp,
        password,
        verificationLink,
      });

      const otpEmailOption = {
        from: "sandaaj@funaab.edu.ng",
        to: email,
        subject: "Thank You for Registering",
        html: generateSignupOtpEmail(email, otp),
      };
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      await transporter.sendMail(otpEmailOption);

      res.status(201).json({
        message: "User created successfully",
        user: newUser,
        verificationLink,
        token,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
