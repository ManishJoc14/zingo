// Backend (Node.js)

const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const availableRooms = new Set();
const onlineUsers = new Map();
const onlineUsersOfARoom = new Map(); // Map to store online users of each room

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", ({ userName }) => {
    console.log(`\n${userName} joining room...`);

    // Set the user's name and ID
    const userId = socket.id;
    onlineUsers.set(userId, userName);
    // Data structure of onlineUsers
    // onlineUsers:
    // {
    //   "userId1": "userName1",
    //   "userId2": "userName2",
    //   .......
    // }

    // Create or join a room
    let roomId;
    if (availableRooms.size > 0) {
      // If a room is available, join it
      roomId = availableRooms.values().next().value;
      console.log(`Joining existing room: ${roomId}`);
    } else {
      // If no room is available, create a new one
      roomId = Math.random().toString(36).substr(2, 6);
      availableRooms.add(roomId);
      console.log(`Creating new room: ${roomId}`);
    }

    // Join the room
    socket.join(roomId);
    console.log(`${userName} joined room: ${roomId}`);

    // Update online users of the room
    if (!onlineUsersOfARoom.has(roomId)) {
      onlineUsersOfARoom.set(roomId, new Map());
      // onlineUsersOfARoom:
      // {
      //   "roomId": new Map([])
      // }
    }
    onlineUsersOfARoom.get(roomId).set(userId, userName);
    // Data structure of onlineUsersOfARoom
    // onlineUsersOfARoom:
    // {
    //   "roomId1": new Map([
    //     ["userId1", "userName1"],
    //     ["userId2", "userName2"]
    //   ]),
    //   "roomId2": new Map([
    //     ["userId1", "userName1"],
    //     ["userId2", "userName2"]
    //   ])
    //  ........
    // }

    // Emit event to all clients in the room
    io.to(roomId).emit("room_joined", { roomId });

    // If room is full, remove it from available rooms
    if (io.sockets.adapter.rooms.get(roomId).size === 2) {
      console.log(`Room ${roomId} is now full`);
      availableRooms.delete(roomId);
      // Emit event to all clients in the room
      io.to(roomId).emit("other_user_joined");
    }

    // Emit the list of online users to all clients
    const userIds = Array.from(onlineUsers.keys());
    const userNames = Array.from(onlineUsers.values());
    io.emit("online_users", { userIds, userNames });

    io.to(roomId).emit("online_users_room", {
      userIds: Array.from(onlineUsersOfARoom.get(roomId).keys()), // user ids in the roomId
      userNames: Array.from(onlineUsersOfARoom.get(roomId).values()), // user names in the roomId
    });
  });

  socket.on("send_message", ({ senderName, message, roomId }) => {
    console.log(
      `Message received from ${senderName} in room ${roomId}: ${message}`
    );
    io.to(roomId).emit("receive_message", { senderName, message });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove the user from the list of online users and online users of the room
    // Get the user name of the disconnected user
    const userName = onlineUsers.get(socket.id);

    onlineUsers.delete(socket.id);
    const roomIds = Array.from(onlineUsersOfARoom.keys());
    roomIds.forEach((roomId) => {
      const usersOfRoom = onlineUsersOfARoom.get(roomId);
      if (usersOfRoom.has(socket.id)) {
        usersOfRoom.delete(socket.id);
        io.to(roomId).emit("online_users_room", {
          userIds: Array.from(usersOfRoom.keys()),
          userNames: Array.from(usersOfRoom.values()),
        });
        // Emit a user_left event to clients in the same room
        io.to(roomId).emit("user_left", { userName });
      }

      // If no users left in the room, delete the room ID
      if (usersOfRoom.size === 0) {
        onlineUsersOfARoom.delete(roomId);
        availableRooms.delete(roomId); // Remove the room ID from availableRooms
      }
    });

    // Emit the list of online users to all clients
    const userIds = Array.from(onlineUsers.keys());
    const userNames = Array.from(onlineUsers.values());
    io.emit("online_users", { userIds, userNames });
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
