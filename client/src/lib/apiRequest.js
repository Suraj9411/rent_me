import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
  withCredentials: true,
});

// Add request interceptor for token fallback
apiRequest.interceptors.request.use(
  (config) => {
    // Add token to Authorization header as fallback if cookies fail
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.id) {
      // Try to get token from document.cookie as fallback
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
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
    return response;
  },
  (error) => {
    // Only log errors in development
    if (import.meta.env.DEV) {
      console.error(`Request failed for ${error.config?.url}:`, error.response?.status, error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiRequest;