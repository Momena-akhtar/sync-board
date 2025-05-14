// socket.ts
import { io, Socket } from "socket.io-client";

// Initialising to null to prevent auto connect
let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });
    console.log("socket", socket);
    socket.on("connect", () => {
      console.log("[Socket connected]:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("[Socket disconnected]");
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket manually disconnected]");
  }
};

export const getSocket = () => socket;