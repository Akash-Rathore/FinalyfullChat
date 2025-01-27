const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Initialize the app and server
const app = express();
const server = http.createServer(app); // HTTP server using Express

// Configure CORS for the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from the React app
    methods: ["GET", "POST"],
  },
});

// Middleware to handle CORS
app.use(cors());

// Store connected users (can be replaced with a database for persistence)
const users = {}; // { socketId: { username, socketId, status, timeout } }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for when a user joins and store their username
  socket.on("join", (username) => {
    users[socket.id] = { username, socketId: socket.id, status: "active", timeout: null };
    console.log(`${username} joined the chat`);

    // Emit updated users list to all clients, excluding the current user
    io.emit("update_users", Object.values(users).filter((user) => user.socketId !== socket.id));
  });

  // Listen for messages in the group chat
  socket.on("send_message", (message) => {
    console.log("Group message received:", message);

    // Send the group message as a string
    const groupMessage = `${users[socket.id]?.username || "Anonymous"}: ${message}`;

    // Broadcast the message to all connected users (group chat)
    io.emit("receive_message", groupMessage);
  });

  // Listen for private messages
  socket.on("send_private_message", (data) => {
    console.log("Private message received:", data);

    const { targetSocketId, message } = data;

    // Send the private message to the target user
    if (users[targetSocketId]) {
      io.to(targetSocketId).emit("receive_private_message", {
        from: users[socket.id].username,
        message,
      });
    } else {
      console.log("Target user not found!");
    }
  });

  // Listen for user activity updates (active or inactive status)
  socket.on("update_status", ({ username, status }) => {
    if (users[socket.id]) {
      users[socket.id].status = status;
      console.log(`${username} is now ${status}`);
      io.emit("update_users", Object.values(users).filter((user) => user.socketId !== socket.id)); // Broadcast updated user list, excluding the current user
    }
  });

  // Handle user inactivity (e.g., no activity for a certain period)
  const handleInactivity = () => {
    if (users[socket.id]) {
      users[socket.id].status = "inactive";
      console.log(`${users[socket.id].username} is now inactive`);
      io.emit("update_users", Object.values(users).filter((user) => user.socketId !== socket.id)); // Broadcast updated user list
    }
  };

  // Set inactivity timeout (e.g., 20 seconds)
  const inactivityTimeout = setTimeout(handleInactivity, 20000); // 20 seconds of inactivity

  // Clear the inactivity timeout on user activity (e.g., mouse or key events)
  socket.on("mousemove", () => {
    clearTimeout(inactivityTimeout); // Reset the inactivity timeout
    setTimeout(handleInactivity, 20000); // Restart inactivity timeout
  });

  socket.on("keydown", () => {
    clearTimeout(inactivityTimeout); // Reset the inactivity timeout
    setTimeout(handleInactivity, 20000); // Restart inactivity timeout
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Clear inactivity timeout for the user
    clearTimeout(users[socket.id]?.timeout);

    // Remove the user from the users object when they disconnect
    delete users[socket.id];

    // Emit updated users list to all clients after a disconnection
    io.emit("update_users", Object.values(users).filter((user) => user.socketId !== socket.id));
  });
});

// Start the server
server.listen(4000, "0.0.0.0", () => {
  console.log("Server is running on port 4000");
});
