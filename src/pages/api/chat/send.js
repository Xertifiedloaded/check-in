import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { content, receiverId } = req.body;
  
      if (!content || !receiverId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      let conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participantIds: { has: session.user.id } },
            { participantIds: { has: receiverId } }
          ]
        }
      });
  
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participantIds: [session.user.id, receiverId],
            participants: {
              connect: [
                { id: session.user.id },
                { id: receiverId }
              ]
            }
          }
        });
      }
  
      // Create message
      const message = await prisma.message.create({
        data: {
          content,
          senderId: session.user.id,
          conversationId: conversation.id,
          readByUserIds: [session.user.id],
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
  
      // Update conversation
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageId: message.id,
          lastMessageContent: content,
          lastMessageTime: message.createdAt,
          lastMessageSenderId: session.user.id,
          updatedAt: new Date()
        }
      });
  
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }