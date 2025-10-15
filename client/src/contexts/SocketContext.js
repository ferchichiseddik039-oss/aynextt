import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Créer la connexion Socket.IO
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? 'https://aynextt.onrender.com' 
      : (process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001');
    
    console.log('🔌 Initialisation WebSocket...');
    console.log('🔌 URL Socket:', socketUrl);
    console.log('🔌 Variables env:', {
      REACT_APP_SOCKET_URL: process.env.REACT_APP_SOCKET_URL,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL
    });
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    if (newSocket) {
      newSocket.on('connect', () => {
        console.log('✅ Connecté au serveur WebSocket');
        console.log('✅ Socket ID:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Déconnecté du serveur WebSocket');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion WebSocket:', error);
        console.error('❌ URL tentée:', socketUrl);
        setIsConnected(false);
      });

      setSocket(newSocket);
      console.log('✅ Socket initialisé');
    }

    // Cleanup
    return () => {
      if (newSocket) {
        console.log('🧹 Fermeture de la connexion WebSocket');
        newSocket.close();
      }
    };
  }, []);

  const joinAdminRoom = () => {
    if (socket && isConnected) {
      socket.emit('join-admin');
      console.log('Rejoint la room admin');
    }
  };

  const leaveAdminRoom = () => {
    if (socket && isConnected) {
      socket.emit('leave-admin');
      console.log('Quitté la room admin');
    }
  };

  const value = {
    socket,
    isConnected,
    joinAdminRoom,
    leaveAdminRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
