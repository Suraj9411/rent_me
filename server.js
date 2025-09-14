import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import apiRoutes from './api/routes/index.js';
import { initializeSocket } from './api/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: [process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000', 'https://houserentalease.onrender.com'],
  credentials: true
}));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/dist'), {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
  lastModified: true,
}));

// Serve CSS files with proper MIME type
app.use('/assets', express.static(path.join(__dirname, 'client/dist/assets'), {
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
}));

// Debug middleware to log API requests
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`API Request: ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    console.log('Request cookies:', req.cookies);
    console.log('Request headers:', req.headers);
  } else if (req.url.includes('.css') || req.url.includes('.js') || req.url.includes('.html')) {
    console.log(`Serving static file: ${req.url}`);
  }
  next();
});

// API routes (your existing backend)
app.use('/api', apiRoutes);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Initialize socket.io
const { server, io } = initializeSocket(app);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'client/dist')}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.io initialized and ready`);
});
