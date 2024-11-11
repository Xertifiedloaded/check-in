// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let io; // Singleton instance

const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3000", // Adjust according to your frontend's origin
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('join', (userId) => {
        if (userId) {
          socket.join(userId);
          console.log(`User ${userId} joined room: ${userId}`);
        }
      });

      socket.on('send-message', (message) => {
        if (message.receiverId) {
          io.to(message.receiverId).emit('receive-message', message);
          console.log(`Message sent to ${message.receiverId}:`, message);
        }
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  return io;
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io with the HTTP server
  initSocket(server);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
