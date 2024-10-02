import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      const newSocket = io();

      newSocket.on('connect', () => {
        console.log('connected to socket server');
      });

      newSocket.on('disconnect', () => {
        console.log('disconnected from socket server');
      });

      setSocket(newSocket);
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};