const { Server } = require("socket.io");
const {
  handleJoinRoom,
  handleSendMessage,
  handleDisconnect,
} = require("./socketHandlers");

// Function to initialize socket
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
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
