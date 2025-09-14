import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { useNotificationStore } from "../lib/notificationStore";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const fetch = useNotificationStore((state) => state.fetch);

  useEffect(() => {
    try {
      const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:8800";
      console.log("Initializing socket connection to:", socketUrl);
      
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Set socket immediately so it's available
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected successfully with ID:", newSocket.id);
        setIsConnected(true);
        
        // If we have a current user, emit newUser immediately after connection
        if (currentUser) {
          console.log("Emitting newUser immediately after connection for:", currentUser.id);
          newSocket.emit("newUser", currentUser.id);
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
        setIsConnected(true);
        
        // Re-emit newUser after reconnection
        if (currentUser) {
          console.log("Re-emitting newUser after reconnection for:", currentUser.id);
          newSocket.emit("newUser", currentUser.id);
        }
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log("Socket reconnection attempt:", attemptNumber);
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("Socket reconnection error:", error);
      });

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } catch (error) {
      console.error("Error creating socket:", error);
      setSocket(null);
      setIsConnected(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && socket && isConnected) {
      console.log("Emitting newUser event for:", currentUser.id);
      console.log("Socket connected:", socket.connected);
      console.log("Socket ID:", socket.id);
      
      // Emit newUser event
      socket.emit("newUser", currentUser.id);

      // Listen for new messages to refresh notifications
      const handleNewMessage = (data) => {
        console.log("New message received, refreshing notifications", data);
        // Small delay to ensure message is saved to database first
        setTimeout(() => {
          fetch().catch(err => console.log("Failed to refresh notifications:", err));
        }, 500);
        
        // Also trigger a custom event for components that need to know about new messages
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('newMessageReceived', { detail: data }));
        }
      };

      // Listen for online users updates
      const handleOnlineUsers = (users) => {
        console.log("Received online users update:", users);
        // Broadcast to all components that need online status
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('onlineUsersUpdate', { detail: users }));
        }
      };

      socket.on("getMessage", handleNewMessage);
      socket.on("getOnlineUsers", handleOnlineUsers);

      return () => {
        if (socket && typeof socket.off === 'function') {
          socket.off("getMessage", handleNewMessage);
          socket.off("getOnlineUsers", handleOnlineUsers);
        }
      };
    } else if (!currentUser && socket) {
      // User logged out - emit logout event to remove from online users
      console.log("User logged out, emitting logout event");
      socket.emit("logout");
    }
  }, [currentUser, socket, isConnected, fetch]);

  // Additional effect to ensure newUser is emitted when user changes
  useEffect(() => {
    if (currentUser && socket && isConnected) {
      // Small delay to ensure socket is fully ready
      const timer = setTimeout(() => {
        console.log("Re-emitting newUser after user change for:", currentUser.id);
        socket.emit("newUser", currentUser.id);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser?.id, socket, isConnected]);

  // Heartbeat to keep user online
  useEffect(() => {
    if (currentUser && socket && isConnected) {
      const heartbeat = setInterval(() => {
        if (socket.connected) {
          console.log("Sending heartbeat to keep user online:", currentUser.id);
          socket.emit("heartbeat", currentUser.id);
        }
      }, 25000); // Every 25 seconds (before 30 second timeout)
      
      return () => clearInterval(heartbeat);
    }
  }, [currentUser, socket, isConnected]);

  // Handle page visibility changes (user switching tabs, minimizing, etc.)
  useEffect(() => {
    if (currentUser && socket && isConnected) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          console.log("Page hidden, user might be switching tabs");
        } else {
          console.log("Page visible again, ensuring user is online");
          socket.emit("newUser", currentUser.id);
        }
      };

      const handleBeforeUnload = () => {
        console.log("User leaving page, emitting logout event");
        socket.emit("logout");
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", handleBeforeUnload);
      
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [currentUser, socket, isConnected]);

  // Debug logging
  useEffect(() => {
    console.log("SocketContext - socket state:", socket);
    console.log("SocketContext - socket type:", typeof socket);
    console.log("SocketContext - isConnected:", isConnected);
    if (socket) {
      console.log("SocketContext - socket methods:", {
        on: typeof socket.on,
        emit: typeof socket.emit,
        off: typeof socket.off
      });
    }
  }, [socket, isConnected]);

  // Expose global notification refresh function
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshNotifications = () => {
        console.log("Global notification refresh triggered");
        fetch().catch(err => console.log("Global notification refresh failed:", err));
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.refreshNotifications;
      }
    };
  }, [fetch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};