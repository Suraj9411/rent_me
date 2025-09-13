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
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  } catch (error) {
    console.error("Profile loader error:", error);
    throw new Error("Failed to load profile data. Please try again.");
  }
};