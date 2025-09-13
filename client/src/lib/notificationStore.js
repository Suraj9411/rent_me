import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set, get) => ({
  number: 0,
  fetch: async () => {
    try {
      console.log("Fetching notifications...");
      const res = await apiRequest("/users/notification");
      console.log("Notification count received:", res.data);
      set({ number: res.data });
      console.log("Notification store updated to:", get().number);
    } catch (error) {
      console.log("Failed to fetch notifications:", error);
      set({ number: 0 });
    }
  },
  decrease: () => {
    const prev = get().number;
    set((state) => ({ number: Math.max(0, state.number - 1) }));
    console.log(`Notification decreased from ${prev} to ${get().number}`);
  },
  reset: () => {
    console.log("Notifications reset to 0");
    set({ number: 0 });
  },
}));