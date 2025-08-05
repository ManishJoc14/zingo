// SocketContext.js
import React, { createContext } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const SOCKET_URL = "https://zingo-backend.onrender.com";
  const socket = io(SOCKET_URL);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export default SocketProvider;
