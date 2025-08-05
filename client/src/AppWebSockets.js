import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
const socket = io("https://zingo-backend.onrender.com");

function App() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [onlineUsersNames, setOnlineUsersNames] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showNameInput, setShowNameInput] = useState(true);
  const [isOtherJoined, setIsOtherJoined] = useState(false);

  useEffect(() => {
    const handleReceiveMessage = ({ senderName, message }) => {
      setMessages((prevMessages) => [...prevMessages, { senderName, message }]);
    };

    socket.on("room_joined", ({ userId, roomId }) => {
      setRoomId(roomId);
      setUserId(userId);
    });

    socket.on("user_left", ({ userName }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderName: "System", message: `${userName} left the chat.` },
      ]);
    });

    socket.on("online_users_room", ({ userIds, userNames }) => {
      setOnlineUsersNames(userNames);
    });

    socket.on("other_user_joined", () => {
      setIsOtherJoined(true);
    });

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message");
      socket.off("room_joined");
      socket.off("user_left");
      socket.off("online_users_room");
    };
  }, []);

  const handleJoinRoom = () => {
    socket.emit("join_room", { userName });
    setShowNameInput(false);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      senderName: userName,
      senderId: userId,
      message,
      roomId,
      timestamp: new Date(),
    });
    setMessage("");
  };
  const disconnectChat = () => {
    socket.disconnect(); // disconnect the socket
    socket.connect(); // re-connect the socket
    setRoomId(null);
    setMessages([]);
    setShowNameInput(true);
    setIsOtherJoined(false);
  };

  return (
    <div className="app">
      {showNameInput ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Start Chatting</button>
        </div>
      ) : roomId && isOtherJoined ? (
        <div>
          <p>Online Users: {onlineUsersNames.join(", ")}</p>
          <button onClick={disconnectChat}>Leave Room</button>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                {msg.senderName}: {msg.message}
              </li>
            ))}
          </ul>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <p>Waiting for someone to join the chat room...</p>
      )}
    </div>
  );
}

export default App;
