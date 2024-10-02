import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', socket => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('createComment', (newComment) => {
      console.log('New comment created:', newComment);
      io.emit('newComment', newComment);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  console.log('Socket is initialized');
  res.end();
};

export default SocketHandler;