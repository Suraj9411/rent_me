import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "https://renteasee-ei1p.onrender.com/api",
  withCredentials: true,
});

// Add request interceptor for debugging and token fallback
apiRequest.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    console.log("Current cookies:", document.cookie);
    console.log("withCredentials:", config.withCredentials);
    
    // Add token to Authorization header as fallback if cookies fail
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.id) {
      // Try to get token from document.cookie as fallback
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added token to Authorization header as fallback");
      } else {
        console.log("No token cookie found, relying on HTTP-only cookie");
      }
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling 401 errors
apiRequest.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`Request failed for ${error.config?.url}:`, error.response?.status, error.message);
    
    // If it's a 401 error, try to refresh the page or redirect to login
    if (error.response?.status === 401) {
      console.log("401 error detected, checking if user should be logged out");
      // Don't automatically redirect, let the components handle it
    }
    
    return Promise.reject(error);
  }
);

export default apiRequest;