const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const postRoutes = require('./post.route');
const chatRoutes = require('./chat.route');
const messageRoutes = require('./message.route');
const testRoutes = require('./test.route');

const router = express.Router();

// Use all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/chats', chatRoutes);
router.use('/messages', messageRoutes);
router.use('/test', testRoutes);

module.exports = router;
