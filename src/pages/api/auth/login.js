

import databaseConnection from "@/lib/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import User from "@/model/User";

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ message: "Account not verified. Please verify your OTP." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          email: user.email,
         userId: user._id,
          name: user.name,
          token: user.token,
        },
        process.env.JWT_SECRET
      );
      user.token = token;
      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);
      res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}