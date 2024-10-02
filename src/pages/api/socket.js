// pages/api/socket.js
import { Server } from 'socket.io';

export const config = {
    api: {
        bodyParser: false, 
    },
};

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
        res.end();
        return;
    }

    const io = new Server(res.socket.server); 

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('message', (data) => {
            console.log('Message received:', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    res.socket.server.io = io; 
    res.end();
};

export default SocketHandler;
