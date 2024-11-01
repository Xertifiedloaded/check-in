
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";



export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { conversationId } = req.query;
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          isDeleted: false
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profilePicture: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { conversationId, content, type = 'text' } = req.body;

      const newMessage = await prisma.$transaction(async (prisma) => {
        // Create the message
        const message = await prisma.message.create({
          data: {
            conversation: {
              connect: { id: conversationId }
            },
            sender: {
              connect: { id: session.user.id }
            },
            content,
            type
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

        // Update conversation with last message details
        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageContent: content,
            lastMessageTime: message.createdAt,
            lastMessageSenderId: session.user.id,
            updatedAt: new Date()
          }
        });

        return message;
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}