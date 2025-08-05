const { Server } = require("socket.io");
const {
  handleJoinRoom,
  handleSendMessage,
  handleDisconnect,
} = require("./socketHandlers");

const allowedOrigins = [
  "http://localhost:3000",
  "https://zingo-delta.vercel.app",
];

// Function to initialize socket
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  // Handle socket connections and events
  io.on("connection", (socket) => {
    socket.on("join_room", handleJoinRoom(socket, io));
    socket.on("send_message", handleSendMessage(socket, io));
    socket.on("disconnect", handleDisconnect(socket, io));
  });
};

module.exports = { initializeSocket };
