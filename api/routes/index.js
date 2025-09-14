import express from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import postRoutes from './post.route.js';
import chatRoutes from './chat.route.js';
import messageRoutes from './message.route.js';
import testRoutes from './test.route.js';

const router = express.Router();

// Use all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/chats', chatRoutes);
router.use('/messages', messageRoutes);
router.use('/test', testRoutes);

export default router;
