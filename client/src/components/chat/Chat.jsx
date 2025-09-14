import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { useNavigate } from "react-router-dom";
import OnlineStatus from "../ui/OnlineStatus";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { socket, isConnected } = useContext(SocketContext);
  const navigate = useNavigate();

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Listen for online users
  useEffect(() => {
    if (socket && typeof socket.on === 'function') {
      socket.on("getOnlineUsers", (users) => {
        console.log("Profile Chat - Received online users from socket:", users);
        setOnlineUsers(users || []);
      });
    }

    // Listen for global online users updates
    const handleOnlineUsersUpdate = (event) => {
      console.log("Profile Chat - Received online users from global event:", event.detail);
      setOnlineUsers(event.detail || []);
    };

    window.addEventListener('onlineUsersUpdate', handleOnlineUsersUpdate);

    return () => {
      if (socket && typeof socket.off === 'function') {
        socket.off("getOnlineUsers");
      }
      window.removeEventListener('onlineUsersUpdate', handleOnlineUsersUpdate);
    };
  }, [socket]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (currentUser && !res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
      
      // Refresh notifications since chat was opened (marks messages as read)
      if (typeof window !== 'undefined' && window.refreshNotifications) {
        console.log("Profile chat opened, refreshing notifications");
        setTimeout(() => {
          window.refreshNotifications();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChatClick = (chatId) => {
    // Navigate to the chat page
    navigate(`/chats/${chatId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const desc = formData.get("desc");

    if (!desc) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { desc });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {chats?.map((c) => (
            <div
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                (currentUser && c.seenBy.includes(currentUser.id)) || chat?.id === c.id
                  ? "bg-white border border-gray-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
              key={c.id}
              onClick={() => handleChatClick(c.id)}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={c.receiver?.avatar || "/noavatar.jpg"} 
                  alt="" 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/noavatar.jpg";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 truncate">{c.receiver.username}</span>
                    <OnlineStatus userId={c.receiver?.id} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {currentUser && c.lastMessageSender === currentUser.id ? "You: " : ""}
                      {c.lastMessage}
                    </p>
                    {c.unreadCount > 0 && (
                      <div className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                        {c.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {chat && (
        <div className="flex-1 border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={chat.receiver?.avatar || "/noavatar.jpg"} 
                alt="" 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/noavatar.jpg";
                }}
              />
              <span className="font-semibold text-gray-800">{chat.receiver.username}</span>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setChat(null)}
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chat.messages.map((message) => (
              <div
                className={`flex ${currentUser && message.userId === currentUser.id ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  currentUser && message.userId === currentUser.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}>
                  <p className="text-sm">{message.desc}</p>
                  <span className={`text-xs ${
                    currentUser && message.userId === currentUser.id ? "text-indigo-200" : "text-gray-500"
                  }`}>
                    {format(message.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <textarea 
                name="desc" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows="2"
                placeholder="Type a message..."
              ></textarea>
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;