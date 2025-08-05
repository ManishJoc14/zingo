const express = require("express");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket");

// Initialize Express app and server
const app = express();
app.use(cors({
  origin: "https://zingo-delta.vercel.app",
}));

app.get("/", (req, res) => {
  res.json({
    developer: "Manish Joshi",
    message: "Welcome to Zingo backend!",
  });
});

const server = http.createServer(app);

// Initialize socket.io
initializeSocket(server);

// Set port
const PORT = process.env.PORT || 3001;

// Start listening on the port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
