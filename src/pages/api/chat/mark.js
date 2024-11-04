
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { conversationId } = req.body;

    await prisma.message.updateMany({
      where: {
        conversationId,
        NOT: {
          readByUserIds: {
            has: session.user.id
          }
        }
      },
      data: {
        readByUserIds: {
          push: session.user.id
        }
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}