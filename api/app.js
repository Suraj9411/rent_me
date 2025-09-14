import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import { initializeSocket } from "./socket.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;
const CLIENT_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ 
  origin: [CLIENT_URL, "https://houserentalease.onrender.com", "http://localhost:5173"],
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

// Initialize socket.io
const { server } = initializeSocket(app);

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