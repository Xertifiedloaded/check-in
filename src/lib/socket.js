const { Server } = require('socket.io');

let io;

exports.initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;

    if (userId) {
      // Update user status to online
      // updateUserStatus(userId, true);

      // Join user's personal room
      socket.join(userId);
    }

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('user_typing', { userId });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('user_stop_typing', { userId });
    });

    socket.on('disconnect', async () => {
      if (userId) {
        // await updateUserStatus(userId, false);
      }
    });
  });

  return io;
};

exports.io = io;