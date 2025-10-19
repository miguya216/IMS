// backend/socketServer.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Or restrict to your domain
    methods: ["GET", "POST"],
  },
});

// Optional test route
app.get("/", (req, res) => res.send("Socket server running"));

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Function to emit events (can be called by PHP)
export function emitRequestUpdate(data = {}) {
  io.emit("request_updated", data);
  console.log("📣 request_updated event emitted");
}

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));
