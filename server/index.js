const express = require("express");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket");

// Initialize Express app and server
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const server = http.createServer(app);

app.get("/", (req, res) => {
  // Initialize socket.io
  initializeSocket(server);
  res.send("Hello World!");
});

// Set port
const PORT = process.env.PORT || 3001;

// Start listening on the port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
