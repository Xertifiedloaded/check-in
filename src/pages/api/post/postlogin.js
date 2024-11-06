
import cookiesSerialize, { comparePassword, generateToken } from "@/lib/auth";
import { prisma } from "../../../lib/prisma";


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      if (user.isGoogleAuth) {
        return res.status(400).json({ message: "Please log in with Google" });
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const token = generateToken(user);
      const cookie = cookiesSerialize(token);
      res.setHeader("Set-Cookie", cookie);
      res.status(200).json({ user, token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
