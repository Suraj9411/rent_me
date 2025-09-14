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
app.use(express.static(path.join(__dirname, 'client/dist')));

// API routes (your existing backend)
app.use('/api', apiRoutes);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
