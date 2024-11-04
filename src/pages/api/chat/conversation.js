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
  
      const conversations = await prisma.conversation.findMany({
        where: {
          participantIds: {
            has: session.user.id
          }
        },
        include: {
          participants: {
            where: {
              id: {
                not: session.user.id
              }
            },
            select: {
              id: true,
              name: true,
              profilePicture: true,
              username: true,
              isOnline: true,
              lastSeen: true,
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
  
      // Format conversations for the frontend
      const formattedConversations = conversations.map(conv => ({
        id: conv.id,
        participant: conv.participants[0],
        lastMessage: conv.messages[0]?.content || null,
        lastMessageTime: conv.messages[0]?.createdAt || null,
        unreadCount: conv.messages.filter(msg => 
          !msg.readByUserIds.includes(session.user.id)
        ).length
      }));
  
      return res.status(200).json(formattedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }