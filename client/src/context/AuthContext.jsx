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
    const verifyAuth = async (retryCount = 0) => {
      try {
        // If we have user data in localStorage, verify it with the server
        if (currentUser) {
          console.log(`Verifying authentication for user: ${currentUser.id} (attempt ${retryCount + 1})`);
          const response = await apiRequest.get("/auth/verify");
          if (response.data) {
            console.log("Authentication verified successfully");
            setCurrentUser(response.data);
          } else {
            console.log("Authentication verification returned no data, clearing user");
            setCurrentUser(null);
            localStorage.removeItem("user");
          }
        } else {
          console.log("No current user found, skipping verification");
        }
      } catch (error) {
        console.log(`Auth verification failed (attempt ${retryCount + 1}):`, error);
        
        // Retry up to 2 times for network errors
        if (retryCount < 2 && (!error.response || error.response.status >= 500)) {
          console.log(`Retrying authentication verification in 1 second...`);
          setTimeout(() => verifyAuth(retryCount + 1), 1000);
          return;
        }
        
        // Only clear user data if it's a 401/403 error, not network errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed, clearing user data");
          setCurrentUser(null);
          localStorage.removeItem("user");
        } else {
          console.log("Network error during verification, keeping user data");
        }
      } finally {
        if (retryCount === 0 || retryCount >= 2) {
          setLoading(false);
        }
      }
    };

    // Add a small delay to ensure the app is fully loaded
    const timer = setTimeout(() => verifyAuth(0), 100);
    return () => clearTimeout(timer);
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