import { Server } from 'socket.io';

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    socket.on('send-message', (message) => {
      socket.broadcast.emit('receive-message', message);
    });
  });

  res.end();
}
