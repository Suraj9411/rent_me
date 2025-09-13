import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    // Get current user ID from token if available
    let currentUserId = null;
    const token = req.cookies?.token;
    
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        currentUserId = payload.id;
      } catch (jwtErr) {
        // JWT verification failed, continue without user ID
      }
    }

    const allPosts = await prisma.post.findMany({
      where: {
        city: query.city ? {
          contains: query.city,
          mode: 'insensitive'
        } : undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
        // Exclude current user's own properties
        ...(currentUserId && { userId: { not: currentUserId } }),
      },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Filter out posts with null user relationships
    const posts = allPosts.filter(post => post.user);

    if (currentUserId) {
      try {
        // Get saved posts for the current user
        const savedPosts = await prisma.savedPost.findMany({
          where: { userId: currentUserId },
          select: { postId: true },
        });
        
        const savedPostIds = new Set(savedPosts.map(sp => sp.postId));
        
        // Add isSaved property to each post
        const postsWithSavedStatus = posts.map(post => ({
          ...post,
          isSaved: savedPostIds.has(post.id)
        }));
        
        res.status(200).json(postsWithSavedStatus);
      } catch (jwtErr) {
        // JWT verification failed, return posts without saved status
        const postsWithoutSavedStatus = posts.map(post => ({
          ...post,
          isSaved: false
        }));
        res.status(200).json(postsWithoutSavedStatus);
      }
    } else {
      // No token provided, return posts without saved status
      const postsWithoutSavedStatus = posts.map(post => ({
        ...post,
        isSaved: false
      }));
      res.status(200).json(postsWithoutSavedStatus);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user exists, if not delete the orphaned post and return error
    if (!post.user) {
      // Delete the orphaned post
      await prisma.post.delete({
        where: { id }
      });
      return res.status(404).json({ message: "Post owner not found. Post has been removed." });
    }

    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        return res.status(200).json({ ...post, isSaved: saved ? true : false });
      } catch (jwtErr) {
        // JWT verification failed, continue without saved status
        return res.status(200).json({ ...post, isSaved: false });
      }
    }
    
    // No token provided
    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Convert coordinates to strings as expected by the schema
    const postData = {
      ...body.postData,
      latitude: String(body.postData.latitude),
      longitude: String(body.postData.longitude),
      userId: tokenUserId,
    };

    const newPost = await prisma.post.create({
      data: {
        ...postData,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // First, check if the post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Convert coordinates to strings as expected by the schema
    const postData = {
      ...body.postData,
      latitude: String(body.postData.latitude),
      longitude: String(body.postData.longitude),
    };

    // Update the post and its details
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        postDetail: {
          update: body.postDetail,
        },
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Delete associated saved posts first (if any)
    await prisma.savedPost.deleteMany({
      where: { postId: id },
    });

    // Delete the postDetail first (if it exists)
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: id },
      });
    }

    // Then delete the post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// Cleanup function to remove orphaned posts
export const cleanupOrphanedPosts = async (req, res) => {
  try {
    // Get all posts with their user relationships
    const allPosts = await prisma.post.findMany({
      include: {
        user: {
          select: { id: true }
        }
      }
    });

    // Find posts with null user relationships
    const orphanedPosts = allPosts.filter(post => !post.user);

    if (orphanedPosts.length === 0) {
      return res.status(200).json({ message: "No orphaned posts found" });
    }

    // Delete orphaned posts
    const deleteResult = await prisma.post.deleteMany({
      where: {
        id: {
          in: orphanedPosts.map(post => post.id)
        }
      }
    });

    res.status(200).json({ 
      message: `Cleaned up ${deleteResult.count} orphaned posts` 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to cleanup orphaned posts" });
  }
};