import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { id: session.user.id }
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return res.status(200).json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  }

  if (req.method === 'POST') {
    const { participantId, content, conversationId } = req.body;

    try {
      const result = await prisma.$transaction(async (tx) => {
        let conversation;

        // Check if a conversation already exists
        if (!conversationId && !content) {
          conversation = await tx.conversation.findFirst({
            where: {
              AND: [
                { participants: { some: { id: session.user.id } } },
                { participants: { some: { id: participantId } } }
              ]
            },
            include: {
              participants: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profilePicture: true,
                }
              }
            }
          });

          // Create a new conversation if none exists
          if (!conversation) {
            conversation = await tx.conversation.create({
              data: {
                participants: {
                  connect: [{ id: session.user.id }, { id: participantId }]
                }
              },
              include: {
                participants: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    profilePicture: true,
                  }
                }
              }
            });
          }

          return { conversation };
        }

        // If content is provided, create a message in the conversation
        conversation = await tx.conversation.upsert({
          where: { id: conversationId || 'new' },
          create: {
            participants: {
              connect: [{ id: session.user.id }, { id: participantId }]
            }
          },
          update: {},
          include: {
            participants: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePicture: true,
              }
            }
          }
        });

        // Create a message for the conversation
        const message = await tx.message.create({
          data: {
            conversation: { connect: { id: conversation.id } },
            sender: { connect: { id: session.user.id } },
            content,
            type: 'text'
          },
          include: {
            sender: {
              select: { id: true, name: true, profilePicture: true }
            }
          }
        });

        await tx.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() }
        });

        return { conversation, message };
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error creating message:', error);
      return res.status(500).json({ message: 'Failed to create message' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
