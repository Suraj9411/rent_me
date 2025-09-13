import { Server } from "socket.io";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.SOCKET_PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server({
  cors: {
    origin: CLIENT_URL,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  // Remove user if already exists (reconnection case)
  onlineUser = onlineUser.filter((user) => user.userId !== userId);
  // Add user with new socket ID
  onlineUser.push({ userId, socketId });
  console.log(`User ${userId} added with socket ${socketId}. Total online:`, onlineUser.length);
  // Emit updated online users to all clients
  io.emit("getOnlineUsers", onlineUser.map(user => user.userId));
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  // Emit updated online users to all clients
  io.emit("getOnlineUsers", onlineUser.map(user => user.userId));
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("newUser", (userId) => {
    console.log(`New user joining: ${userId} with socket: ${socket.id}`);
    addUser(userId, socket.id);
    console.log("Current online users:", onlineUser.map(u => u.userId));
    // Emit current online users to the newly connected user
    socket.emit("getOnlineUsers", onlineUser.map(user => user.userId));
    // Also emit to all clients to update their online status
    io.emit("getOnlineUsers", onlineUser.map(user => user.userId));
  });

  // Handle user reconnection (same user, different socket)
  socket.on("reconnectUser", (userId) => {
    console.log(`User reconnecting: ${userId} with new socket: ${socket.id}`);
    addUser(userId, socket.id);
  });

  // Handle heartbeat to keep user online
  socket.on("heartbeat", (userId) => {
    const user = onlineUser.find(u => u.userId === userId);
    if (user && user.socketId === socket.id) {
      // Reset the disconnect timeout for this user
      console.log(`Heartbeat received from user ${userId}, keeping online`);
      // Clear any existing timeout for this socket
      if (socket.disconnectTimeout) {
        clearTimeout(socket.disconnectTimeout);
      }
    }
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    console.log(`Sending message from socket ${socket.id} to user ${receiverId}`);
    const receiver = getUser(receiverId);
    if (receiver) {
      console.log(`Receiver found with socket ${receiver.socketId}`);
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.log(`Receiver ${receiverId} not found online`);
    }
  });

  socket.on("logout", () => {
    console.log(`User logout event received from socket ${socket.id}`);
    removeUser(socket.id);
    console.log("User removed from online list. Remaining online users:", onlineUser.length);
    console.log("Broadcasting updated online users list to all clients");
  });

  socket.on("disconnect", () => {
    // Don't immediately remove user on disconnect (might be temporary)
    // Only remove if it's been more than 30 seconds
    socket.disconnectTimeout = setTimeout(() => {
      const user = onlineUser.find(u => u.socketId === socket.id);
      if (user) {
        console.log(`User ${user.userId} disconnected after timeout, removing from online list`);
        removeUser(socket.id);
      }
    }, 30000); // 30 second timeout
    
    console.log("User disconnected:", socket.id);
    console.log("Online users:", onlineUser.length);
  });
});

io.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}!`);
  console.log(`Client URL: ${CLIENT_URL}`);
});

// Debug endpoint to check online users
io.engine.on("connection", (socket) => {
  console.log(`Engine connection: ${socket.id}`);
});

// Log online users every 30 seconds for debugging
setInterval(() => {
  console.log(`[DEBUG] Current online users: ${onlineUser.length}`, onlineUser.map(u => u.userId));
}, 30000);
