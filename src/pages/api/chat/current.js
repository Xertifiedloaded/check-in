import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";


export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
          username: true,
          isOnline: true,
          lastSeen: true,
        },
      });
  
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }