// src/socket.js
import { io } from "socket.io-client";

let SOCKET_URL = "";

// Automatically choose URL based on environment
if (import.meta.env.MODE === "development") {
  SOCKET_URL = "http://localhost:4000"; // dev server
} else {
  SOCKET_URL = `${window.location.origin}`; // production (same domain)
}

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

// Optional: simple console logs
socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});
