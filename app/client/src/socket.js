import { io } from "socket.io-client";

// Auto-selects backend URL based on environment
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: false, // Prevents auto-connect before setup
});
