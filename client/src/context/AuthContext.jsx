import { createContext, useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  // Verify authentication on app load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // If we have user data in localStorage, verify it with the server
        if (currentUser) {
          const response = await apiRequest.get("/auth/verify");
          if (response.data) {
            setCurrentUser(response.data);
          } else {
            // Token is invalid, clear user data
            setCurrentUser(null);
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.log("Auth verification failed:", error);
        // Token is invalid or expired, clear user data
        setCurrentUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};