import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";

const OnlineStatus = ({ userId, className = "" }) => {
  const { onlineUsers } = useContext(SocketContext);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (onlineUsers && Array.isArray(onlineUsers)) {
      setIsOnline(onlineUsers.includes(userId));
    }
  }, [onlineUsers, userId]);

  // Listen for global online users updates
  useEffect(() => {
    const handleOnlineUsersUpdate = (event) => {
      const users = event.detail || [];
      setIsOnline(users.includes(userId));
    };

    window.addEventListener('onlineUsersUpdate', handleOnlineUsersUpdate);

    return () => {
      window.removeEventListener('onlineUsersUpdate', handleOnlineUsersUpdate);
    };
  }, [userId]);

  return (
    <div 
      className={`w-3 h-3 rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      } ${className}`}
      title={isOnline ? "Online" : "Offline"}
    />
  );
};

export default OnlineStatus;
