import { io } from "socket.io-client";

// Dynamically choose URL based on environment
const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "https://crm-system-1-auch.onrender.com"
    : "http://localhost:4000";

// Initialize socket connection
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // ensures WebSocket is used
  autoConnect: true,
});

// Connection success
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

// Example listener for messages
socket.on("message", (data) => {
  console.log("New message:", data);
});

export default socket;
