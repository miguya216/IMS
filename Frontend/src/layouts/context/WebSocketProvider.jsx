// src/layouts/context/WebSocketProvider.jsx
import React, { createContext, useContext } from "react";
import UseWebsocket from "/src/layouts/hooks/UseWebsocket.jsx";

// Create a Context for WebSocket
const WebSocketContext = createContext(null);

// Provider component — holds one global WebSocket connection
export const WebSocketProvider = ({ children }) => {
  // You can later replace this with an .env value
  // localhosting
  // const socket = UseWebsocket("ws://localhost:8080", { autoReconnect: true }); 
  // webhosting
  const socket = UseWebsocket("wss://ims-server-8jmd.onrender.com", { autoReconnect: true });
   
  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for easy use
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
