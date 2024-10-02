import { Server } from 'socket.io';

let io;
export const socketHandler = (req, res) => {
    if (res.socket.server.io) {
      console.log("Socket is already set up");
      res.end();
      return;
    }
  
    io = new Server(res.socket.server);
    res.socket.server.io = io;
  
    io.on('connection', (socket) => {
      console.log('New client connected');
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  
    res.end();
  };
  