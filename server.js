import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import apiRoutes from './api/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Debug middleware to log static file requests
app.use((req, res, next) => {
  if (req.url.includes('.css') || req.url.includes('.js') || req.url.includes('.html')) {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
