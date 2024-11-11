
import { Server } from 'socket.io';
import { prisma } from '@/lib/prisma';

let io;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!io) {
    const httpServer = res.socket.server;
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`Socket.IO: User connected ${socket.id}`);
    });

    res.socket.server.io = io; 
  }

  try {
    const { content, senderId, receiverId } = req.body;

    if (!content || !senderId || !receiverId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chat = await prisma.chat.upsert({
      where: {
        senderId_receiverId: { senderId, receiverId }, 
      },
      update: {
        lastMessage: content,
        updatedAt: new Date(),
      },
      create: {
        senderId,
        receiverId,
        lastMessage: content,
      },
    });
    const message = await prisma.message.create({
      data: {
        content,
        chatId: chat.id,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    // Emit message to both the sender and receiver rooms
    io.to(senderId).emit('receive-message', message);
    io.to(receiverId).emit('receive-message', message);

    return res.json(message);
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}
