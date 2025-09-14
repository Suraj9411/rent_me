import prisma from "../lib/prisma.js";
import { getIO } from "../socket.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const desc = req.body.desc;

  console.log("Adding message to chat:", chatId, "by user:", tokenUserId, "content:", desc);

  if (!desc || !desc.trim()) {
    return res.status(400).json({ message: "Message content is required!" });
  }

  try {
    // First check if the chat exists and user has access
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) {
      console.log("Chat not found:", chatId);
      return res.status(404).json({ message: "Chat not found!" });
    }

    console.log("Chat found, creating message");

    // Create the message
    const message = await prisma.message.create({
      data: {
        desc: desc.trim(),
        chatId,
        userId: tokenUserId,
      },
    });

    console.log("Message created:", message.id);

    // Update the chat with last message and seenBy
    try {
      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: {
            set: [tokenUserId], // Reset seenBy to only current user
          },
          lastMessage: desc.trim(),
        },
      });
      console.log("Chat updated with last message");
    } catch (updateErr) {
      console.error("Error updating chat:", updateErr);
      // Continue even if chat update fails
    }

    // Emit socket event to notify receiver
    const messageWithChatId = { ...message, chatId };
    
    // Find the receiver (the other user in the chat)
    const receiverId = chat.userIDs.find(id => id !== tokenUserId);
    
    if (receiverId) {
      const io = getIO();
      if (io) {
        // Emit getMessage directly to all connected clients
        // The frontend will filter based on chatId
        io.emit("getMessage", messageWithChatId);
      }
    }

    res.status(200).json(messageWithChatId);
  } catch (err) {
    console.error("Error in addMessage:", err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};