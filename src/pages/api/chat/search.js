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
  
      const { q } = req.query;
  
      if (!q || q.length < 2) {
        return res.status(400).json({ error: "Search query too short" });
      }
  
      const users = await prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { username: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } }
              ]
            },
            { id: { not: session.user.id } },
            { isDeleted: false }
          ]
        },
        select: {
          id: true,
          name: true,
          username: true,
          profilePicture: true,
          isOnline: true,
          lastSeen: true
        },
        take: 10
      });
  
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }





