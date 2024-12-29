import { PrismaClient } from "@prisma/client";
import { authOptions } from '../../../lib/authOptions';
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions); 
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session?.user?.id;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { notificationsEnabled: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ notificationsEnabled: user.notificationsEnabled });
    } catch (error) {
      console.error("Error fetching notification status:", error);
      return res.status(500).json({ error: "Failed to fetch notification status" });
    }
  } else if (req.method === "PUT") {
    const { notificationsEnabled } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { notificationsEnabled },
      });

      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error updating notifications:", error);
      return res.status(500).json({ error: "Failed to update notifications" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
