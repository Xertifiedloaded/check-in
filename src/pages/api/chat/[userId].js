import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { userId } = req.query;
  
      // Find or create conversation between users
      let conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participantIds: { has: session.user.id } },
            { participantIds: { has: userId } }
          ]
        }
      });
  
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participantIds: [session.user.id, userId],
            participants: {
              connect: [
                { id: session.user.id },
                { id: userId }
              ]
            }
          }
        });
      }
  
      // Get messages
      const messages = await prisma.message.findMany({
        where: {
          conversationId: conversation.id
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profilePicture: true
            }
          }
        }
      });
  
      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          senderId: userId,
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
  
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }