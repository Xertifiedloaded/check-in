
import { Server } from "socket.io";

let io; 

export const socketHandler = (req, res) => {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server); 
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected to the socket");

      socket.on("disconnect", () => {
        console.log("User disconnected from the socket");
      });
    });
  } else {
    io = res.socket.server.io; 
  }
};

