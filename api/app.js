import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8800;
const CLIENT_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, "https://renteasee.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.use(cors({ 
  origin: [CLIENT_URL, "https://renteasee.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Socket.io logic
let onlineUsers = [];

const addUser = (userId, socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ userId, socketId });
  console.log(`User ${userId} added with socket ${socketId}. Total online:`, onlineUsers.length);
  io.emit("getOnlineUsers", onlineUsers.map(user => user.userId));
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  io.emit("getOnlineUsers", onlineUsers.map(user => user.userId));
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("newUser", (userId) => {
    console.log(`New user joining: ${userId} with socket: ${socket.id}`);
    addUser(userId, socket.id);
    const onlineUserIds = onlineUsers.map(user => user.userId);
    console.log("Broadcasting online users:", onlineUserIds);
    socket.emit("getOnlineUsers", onlineUserIds);
    io.emit("getOnlineUsers", onlineUserIds);
  });

  socket.on("reconnectUser", (userId) => {
    console.log(`User reconnecting: ${userId} with new socket: ${socket.id}`);
    addUser(userId, socket.id);
    const onlineUserIds = onlineUsers.map(user => user.userId);
    console.log("Broadcasting online users after reconnect:", onlineUserIds);
    io.emit("getOnlineUsers", onlineUserIds);
  });

  socket.on("heartbeat", (userId) => {
    const user = onlineUsers.find(u => u.userId === userId);
    if (user && user.socketId === socket.id) {
      console.log(`Heartbeat received from user ${userId}, keeping online`);
      if (socket.disconnectTimeout) {
        clearTimeout(socket.disconnectTimeout);
      }
    }
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    console.log(`Sending message from socket ${socket.id} to user ${receiverId}`);
    console.log(`Message data:`, data);
    const receiver = getUser(receiverId);
    if (receiver) {
      console.log(`Receiver found with socket ${receiver.socketId}, sending message`);
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`Message sent successfully to ${receiverId}`);
    } else {
      console.log(`Receiver ${receiverId} not found online. Current online users:`, onlineUsers.map(u => u.userId));
    }
  });

  socket.on("logout", () => {
    console.log(`User logout event received from socket ${socket.id}`);
    removeUser(socket.id);
    const onlineUserIds = onlineUsers.map(user => user.userId);
    console.log("User removed from online list. Remaining online users:", onlineUsers.length);
    io.emit("getOnlineUsers", onlineUserIds);
  });

  socket.on("disconnect", () => {
    socket.disconnectTimeout = setTimeout(() => {
      const user = onlineUsers.find(u => u.socketId === socket.id);
      if (user) {
        console.log(`User ${user.userId} disconnected after timeout, removing from online list`);
        removeUser(socket.id);
        const onlineUserIds = onlineUsers.map(user => user.userId);
        io.emit("getOnlineUsers", onlineUserIds);
      }
    }, 30000);
    
    console.log("User disconnected:", socket.id);
    console.log("Online users:", onlineUsers.length);
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Rent Me API Server is running!",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      posts: "/api/posts",
      users: "/api/users",
      chat: "/api/chat",
      messages: "/api/messages"
    }
  });
});

// Health check endpoint for deployment
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
  console.log(`Client URL: ${CLIENT_URL}`);
  console.log(`Socket.io server is also running on the same port!`);
});