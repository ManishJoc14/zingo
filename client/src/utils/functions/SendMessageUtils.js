export const handleKeyDown = (e, socket, name, id, msg, roomId, setMsg) => {
  if (e && e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    socket.emit("send_message", {
      senderName: name,
      senderId: id,
      message: msg,
      roomId,
      timestamp: new Date(),
    });
    setMsg("");
  }
};

export const handleSendEmogi = (e, socket, name, id, roomId) => {
  e.preventDefault();
  socket.emit("send_message", {
    senderName: name,
    senderId: id,
    message: "❤️",
    roomId,
    timestamp: new Date(),
  });
};
