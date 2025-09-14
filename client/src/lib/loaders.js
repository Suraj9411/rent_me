import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  try {
    const res = await apiRequest("/posts/" + params.id);
    return res.data;
  } catch (error) {
    console.error("Loader error:", error);
    if (error.response?.status === 404) {
      throw new Error("Post not found");
    } else if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    } else {
      throw new Error("Failed to load post. Please try again.");
    }
  }
};

export const listPageLoader = async ({ request, params }) => {
  try {
    const query = request.url.split("?")[1];
    const postPromise = apiRequest("/posts?" + query);
    return defer({
      postResponse: postPromise,
    });
  } catch (error) {
    console.error("List loader error:", error);
    throw new Error("Failed to load posts. Please try again.");
  }
};

export const profilePageLoader = async () => {
  try {
    console.log("Profile loader: Starting to fetch data");
    
    // Add a small delay to ensure authentication is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const postPromise = apiRequest("/users/profilePosts").catch(err => {
      console.error("Profile posts request failed:", err);
      if (err.response?.status === 401) {
        throw new Error("Authentication required. Please log in.");
      }
      throw err;
    });
    
    const chatPromise = apiRequest("/chats").catch(err => {
      console.error("Chats request failed:", err);
      if (err.response?.status === 401) {
        throw new Error("Authentication required. Please log in.");
      }
      throw err;
    });
    
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  } catch (error) {
    console.error("Profile loader error:", error);
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    throw new Error("Failed to load profile data. Please try again.");
  }
};