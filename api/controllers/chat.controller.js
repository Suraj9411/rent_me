import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  console.log("Getting chats for user:", tokenUserId);

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get only the latest message
        },
      },
    });

    console.log("Found chats:", chats.length);

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      console.log("Receiver ID:", receiverId);

      if (receiverId) {
        try {
          const receiver = await prisma.user.findUnique({
            where: {
              id: receiverId,
            },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          });
          chat.receiver = receiver;
          console.log("Receiver found:", receiver?.username);
        } catch (receiverErr) {
          console.error("Error finding receiver:", receiverErr);
          chat.receiver = { id: receiverId, username: "Unknown User", avatar: null };
        }
      }

      // Calculate unread message count for this chat using isRead field
      const unreadCount = await prisma.message.count({
        where: {
          chatId: chat.id,
          userId: {
            not: tokenUserId, // Messages not sent by current user
          },
          isRead: false, // Messages not read
        },
      });
      chat.unreadCount = unreadCount;

      // Set last message info
      if (chat.messages && chat.messages.length > 0) {
        chat.lastMessage = chat.messages[0].desc;
        chat.lastMessageTime = chat.messages[0].createdAt;
        chat.lastMessageSender = chat.messages[0].userId;
      } else {
        chat.lastMessage = "No messages yet";
        chat.lastMessageTime = chat.createdAt;
        chat.lastMessageSender = null;
      }

      // Remove the messages array to keep response clean
      delete chat.messages;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error in getChats:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  console.log("Getting chat:", chatId, "for user:", tokenUserId);

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      console.log("Chat not found:", chatId);
      return res.status(404).json({ message: "Chat not found!" });
    }

    console.log("Chat found with", chat.messages?.length || 0, "messages");

    // Ensure seenBy is an array and handle null values
    const seenBy = Array.isArray(chat.seenBy) ? chat.seenBy : [];
    
    // Mark all messages from others as read for this user
    await prisma.message.updateMany({
      where: {
        chatId: chatId,
        userId: {
          not: tokenUserId, // Messages not sent by current user
        },
        isRead: false, // Only update unread messages
      },
      data: {
        isRead: true,
      },
    });

    // Only update if user is not already in seenBy
    if (!seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: {
            push: [tokenUserId],
          },
        },
      });
    }

    // Add receiver information to the response
    const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
    if (receiverId) {
      try {
        const receiver = await prisma.user.findUnique({
          where: { id: receiverId },
          select: { id: true, username: true, avatar: true },
        });
        chat.receiver = receiver;
        console.log("Added receiver info to chat response:", receiver?.username);
      } catch (receiverErr) {
        console.error("Error finding receiver for chat:", receiverErr);
        chat.receiver = { id: receiverId, username: "Unknown User", avatar: null };
      }
    }
    
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in getChat:", err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;
  console.log("Adding chat between:", tokenUserId, "and:", receiverId);

  try {
    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    if (existingChat) {
      console.log("Chat already exists:", existingChat.id);
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
    });
    console.log("New chat created:", newChat.id);
    res.status(200).json(newChat);
  } catch (err) {
    console.error("Error in addChat:", err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  console.log("Marking chat as read:", chatId, "by user:", tokenUserId);

  try {
    const chat = await prisma.chat.update({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in readChat:", err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};