
import { generateToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Password do not match" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password must be Provided" });
    }
    if (!passwordConfirm) {
      return res.status(400).json({ message: "Password must be Provided" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name must be provided" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email must be provided" });
    }
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10); 
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const token = generateToken(newUser);
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
        token,
      });
    } catch (error) {
        console.log(error);
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
