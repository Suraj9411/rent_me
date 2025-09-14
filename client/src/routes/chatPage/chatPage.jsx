import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../hooks/use-toast";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket, isConnected } = useContext(SocketContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Ref for auto-scrolling to last message
  const messagesEndRef = useRef(null);

  // Check if socket is properly initialized
  useEffect(() => {
    if (socket && typeof socket.on === 'function') {
      // Socket event listeners
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users || []);
      });

      socket.on("getMessage", (data) => {
        if (data.chatId === id && data.userId !== currentUser?.id) {
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(msg => msg.id === data.id);
            if (exists) {
              return prev;
            }
            return [...prev, data];
          });
        }
      });

      // Cleanup function
      return () => {
        if (socket && typeof socket.off === 'function') {
          socket.off("getOnlineUsers");
          socket.off("getMessage");
        }
      };
    }
  }, [socket, id, currentUser]);

  // Listen for global online users updates
  useEffect(() => {
    const handleOnlineUsersUpdate = (event) => {
      setOnlineUsers(event.detail || []);
    };

    window.addEventListener('onlineUsersUpdate', handleOnlineUsersUpdate);

    return () => {
      window.removeEventListener('onlineUsersUpdate', handleOnlineUsersUpdate);
    };
  }, []);

  // Fallback: Periodic refresh of messages every 5 seconds if socket is not connected
  useEffect(() => {
    if (!isConnected && id) {
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected, id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await apiRequest.get("/chats");
        console.log("Chats loaded:", res.data);
        setChats(res.data);
        
        // If we have a chat ID in the URL, find and set that chat
        if (id) {
          const targetChat = res.data.find(chat => chat.id === id);
          if (targetChat) {
            console.log("Setting current chat from URL:", targetChat);
            setCurrentChat(targetChat);
            // Load messages for this chat
            loadMessages(id);
          } else {
            console.log("Chat not found in list for ID:", id);
          }
        }
      } catch (err) {
        console.error("Error loading chats:", err);
      }
    };
    getChats();
  }, [id]);

  const loadMessages = async (chatId) => {
    try {
      const res = await apiRequest.get(`/chats/${chatId}`);
      console.log("Messages loaded:", res.data);
      setMessages(res.data.messages);
      
      // Update current chat with full data including receiver info
      const chatData = res.data;
      console.log("Chat data with receiver:", chatData.receiver);
      
      // Ensure we have receiver information
      if (chatData.receiver) {
        setCurrentChat(chatData);
      } else {
        // If no receiver info, try to get it from the userIDs
        const receiverId = chatData.userIDs?.find(uid => uid !== currentUser.id);
        if (receiverId) {
          // Fetch receiver info separately
          try {
            const userRes = await apiRequest.get(`/users/${receiverId}`);
            chatData.receiver = {
              id: userRes.data.id,
              username: userRes.data.username,
              avatar: userRes.data.avatar
            };
            console.log("Fetched receiver info:", chatData.receiver);
            setCurrentChat(chatData);
          } catch (userErr) {
            console.error("Error fetching receiver info:", userErr);
            // Set with placeholder receiver
            chatData.receiver = { id: receiverId, username: "User", avatar: null };
            setCurrentChat(chatData);
          }
        }
      }

      // Refresh notifications since chat was opened (marks messages as read)
      if (typeof window !== 'undefined' && window.refreshNotifications) {
        setTimeout(() => {
          window.refreshNotifications();
        }, 1000); // Small delay to ensure backend has processed the read status
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;

    try {
      setLoading(true);
      const res = await apiRequest.post(`/messages/${id}`, { desc: newMessage.trim() });
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg => msg.id === res.data.id);
        if (exists) {
          return prev;
        }
        return [...prev, res.data];
      });
      setNewMessage("");
      
      // Backend will handle socket emission
    } catch (err) {
      console.error("Error sending message:", err);
      if (err.response?.status === 404) {
        toast({
          title: "Chat Not Found",
          description: "Chat not found. Please try again.",
          variant: "destructive",
        });
      } else if (err.response?.status === 401) {
        toast({
          title: "Login Required",
          description: "Please login to send messages.",
          variant: "warning",
        });
        navigate("/login");
      } else {
        toast({
          title: "Message Failed",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    setShowChat(true);
    // Load messages for the selected chat
    loadMessages(chat.id);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setCurrentChat(null);
    setMessages([]);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const filteredChats = chats.filter(chat => 
    chat.receiver?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-6 h-screen min-h-[600px] md:min-h-[500px]">
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-8xl text-gray-300 mb-6 opacity-30">🔒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Authentication Required</h2>
            <p className="text-gray-600 text-lg max-w-md leading-relaxed">
              Please login to access your chats and start messaging.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 h-full flex flex-col">
        <div className="text-center mb-2 py-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-1 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-gray-100 rounded-full backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-xs font-medium ${isConnected ? 'text-gray-600' : 'text-red-500'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
          {!showChat ? (
            // Conversation List View
            <div className="h-full bg-white flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  Conversations
                </h3>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 bg-white/80 border border-gray-200 rounded-full text-gray-900 text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 bg-white/50 backdrop-blur-sm placeholder:text-gray-400"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        currentChat?.id === chat.id 
                          ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                          : ''
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={chat.receiver?.avatar || "/noavatar.jpg"} 
                        alt={chat.receiver?.username || "User"}
                        className="w-12 h-12 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-100 transition-all duration-200"
                      />
                      <div 
                        className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                          isUserOnline(chat.receiver?.id) ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        title={`${chat.receiver?.username} is ${isUserOnline(chat.receiver?.id) ? 'online' : 'offline'}`}
                      ></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
                          {chat.receiver?.username || "Unknown User"}
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse shadow-sm">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        {chat.lastMessageTime && (
                          <div className="text-gray-400 text-xs font-medium">
                            {formatTime(chat.lastMessageTime)}
                          </div>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                        {chat.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-5xl mb-4 opacity-50">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium mb-2">No conversations found</div>
                  <div className="text-sm opacity-70">
                    {searchTerm ? "Try a different search term" : "Start a conversation by messaging someone!"}
                  </div>
                </div>
                )}
              </div>
            </div>
          ) : (
            // Chat View
            <div className="flex flex-col h-full min-h-0 bg-gray-50">
            {currentChat && currentChat.receiver ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                        <button
                          onClick={handleBackToList}
                          className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-full flex items-center justify-center"
                          title="Back to conversations"
                        >
                      <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="relative">
                      <img 
                        src={currentChat.receiver.avatar || "/noavatar.jpg"} 
                        alt={currentChat.receiver.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div 
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          isUserOnline(currentChat.receiver.id) ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {currentChat.receiver.username}
                      </div>
                      <div className={`text-xs ${
                        isUserOnline(currentChat.receiver.id) ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {isUserOnline(currentChat.receiver.id) ? 'online' : 'last seen recently'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center" title="Search">
                      <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center" title="More options">
                      <svg fill="currentColor" viewBox="0 0 20 20" width="18" height="18">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 min-h-0 scrollbar-thin bg-gray-100" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 max-w-3/4 md:max-w-4/5 items-end ${
                          message.userId === currentUser.id ? 'self-end flex-row-reverse' : 'self-start'
                        }`}
                      >
                        <img 
                          src={message.userId === currentUser.id 
                            ? (currentUser.avatar || "/noavatar.jpg")
                            : (currentChat.receiver.avatar || "/noavatar.jpg")
                          } 
                          alt="Avatar"
                          className="w-9 h-9 sm:w-8 sm:h-8 md:w-7 md:h-7 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                        />
                        <div className="flex flex-col gap-1">
                          <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words relative max-w-full ${
                            message.userId === currentUser.id
                              ? 'bg-green-500 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                          }`}>
                            {message.desc}
                          </div>
                          <div className={`text-xs text-gray-500 ${
                            message.userId === currentUser.id ? 'text-right' : 'text-left'
                          }`}>
                            {formatMessageTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                      <div className="text-6xl mb-4 opacity-50">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="text-xl font-semibold mb-2">Start the conversation</div>
                      <div className="text-sm opacity-70">
                        Send a message to {currentChat.receiver.username} to get started
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                  <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <button type="button" className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-full flex items-center justify-center" title="Attach file">
                      <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                      <textarea
                        className="flex-1 bg-transparent border-0 text-gray-900 text-sm resize-none min-h-6 max-h-20 leading-relaxed focus:outline-none placeholder:text-gray-500"
                        placeholder={`Message ${currentChat.receiver.username}`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        disabled={loading}
                        rows="1"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || !newMessage.trim()}
                      title="Send message"
                    >
                      {loading ? (
                        <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                        </svg>
                      ) : (
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-6xl text-gray-300 mb-6 opacity-40">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">WhatsApp Web</h2>
                <p className="text-gray-500 text-base max-w-sm leading-relaxed">
                  Select a conversation from the left to start messaging
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>End-to-end encrypted</span>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;