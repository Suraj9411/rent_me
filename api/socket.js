import { Server } from "socket.io";
import { createServer } from "http";

let io = null;

export const initializeSocket = (app) => {
  const server = createServer(app);
  const PORT = process.env.PORT || 8800;
  const CLIENT_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";

  io = new Server(server, {
    cors: {
      origin: [CLIENT_URL, "https://houserentalease.onrender.com", "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  // Socket.io logic
  let onlineUsers = [];

  const addUser = (userId, socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ userId, socketId });
    io.emit("getOnlineUsers", onlineUsers.map(user => user.userId));
  };

  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    socket.on("newUser", (userId) => {
      addUser(userId, socket.id);
      const onlineUserIds = onlineUsers.map(user => user.userId);
      socket.emit("getOnlineUsers", onlineUserIds);
      io.emit("getOnlineUsers", onlineUserIds);
    });

    socket.on("reconnectUser", (userId) => {
      addUser(userId, socket.id);
      const onlineUserIds = onlineUsers.map(user => user.userId);
      io.emit("getOnlineUsers", onlineUserIds);
    });

    socket.on("heartbeat", (userId) => {
      const user = onlineUsers.find(u => u.userId === userId);
      if (user && user.socketId === socket.id) {
        if (socket.disconnectTimeout) {
          clearTimeout(socket.disconnectTimeout);
        }
      }
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", data);
      }
    });

    socket.on("logout", () => {
      removeUser(socket.id);
      const onlineUserIds = onlineUsers.map(user => user.userId);
      io.emit("getOnlineUsers", onlineUserIds);
    });

    socket.on("disconnect", () => {
      socket.disconnectTimeout = setTimeout(() => {
        const user = onlineUsers.find(u => u.socketId === socket.id);
        if (user) {
          removeUser(socket.id);
          const onlineUserIds = onlineUsers.map(user => user.userId);
          io.emit("getOnlineUsers", onlineUserIds);
        }
      }, 30000);
    });
  });

  return { server, io };
};

export const getIO = () => io;
