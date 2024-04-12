import React, { useContext, useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import styles from "./ChatDashboard.module.scss";
import { Link } from "react-router-dom";
import userIcon from "../../assets/male.png";
import logo from "../../assets/brand.png";
import formatTimestamp from "../../utils/functions/timestamp";
import io from "socket.io-client";
import {
  setSearchStatus,
  setLoadingStatus,
  setName,
  setId,
  setRoomId,
  setMessages,
  resetMessages,
  setDisconnectingStatus,
  setIsOtherJoined,
  setOnlineUsersIds,
} from "../../redux/userSlice";
import { decodeName } from "../../utils/functions/NameManipulator";

import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
// const socket = io("http://localhost:3001");

const ChatDashboard = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const socket = useContext(SocketContext);

  const {
    name,
    id,
    roomId,
    messages,
    // error,
    // isLoading,
    // isDisconnecting,
    isSearching,
    isOtherJoined,
    onlineUsersNames,
    onlineUsersIds,
  } = useSelector((state) => state.userState);

  const [msg, setMsg] = useState("");

  // Function to scroll to the bottom of the messages when a new message is received
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
  const anotherUserName = () => {
    return onlineUsersNames.filter((userName) => userName !== name);
  };

  const handleMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      senderName: name,
      senderId: id,
      message: msg,
      roomId,
      timestamp: new Date(),
    });
    setMsg("");
  };

  useEffect(() => {
    socket.on("user_left", ({ userName, userId }) => {
      socket.emit("send_message", {
        senderName: userName,
        senderId: userId,
        message: "Sorry, I have to leave the chat.",
        roomId,
        timestamp: new Date(),
      });
      dispatch(setIsOtherJoined(false));
    });

    socket.on(
      "receive_message",
      ({ senderName, senderId, message, timestamp }) => {
        console.log("message received: ", senderName, message, timestamp);
        dispatch(setMessages({ senderName, senderId, message, timestamp }));
      }
    );

    return () => {
      socket.off("receive_message");
      socket.off("user_left");
    };
  }, [roomId, socket, dispatch]);

  const handleKeyDown = (e) => {
    if (e && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMsg("");
      handleSend(e);
    }
  };

  const handleSendEmogi = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      senderName: name,
      senderId: id,
      message: "❤️",
      roomId,
      timestamp: new Date(),
    });
  };

  const handleEndChat = (e) => {
    socket.disconnect();
    socket.connect();
    e.preventDefault();
    dispatch(setRoomId(null));
    dispatch(setLoadingStatus(false));
    dispatch(setDisconnectingStatus(true));
    dispatch(setIsOtherJoined(false));
    dispatch(setSearchStatus(false));
  };

  const handleFindNext = () => {
    socket.disconnect();
    socket.connect();

    const usersData = JSON.parse(localStorage.getItem("userData"));
    if (usersData) {
      dispatch(setName(usersData?.nickName));
    }
    dispatch(setId(null));
    dispatch(setSearchStatus(true));
    dispatch(setLoadingStatus(true));
    dispatch(setDisconnectingStatus(false));
    dispatch(setIsOtherJoined(false));
    dispatch(resetMessages());
    socket.emit("join_room", { userName: name });
  };

  return (
    <div className={styles.body}>
      <section className={styles.msger}>
        <header className={styles["msger-header"]}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="userIcon" className={styles.siteLogo} />
            </Link>
          </div>
          <div className={styles.joinedUser}>
            <img src={userIcon} alt="userIcon" className={styles.userIcon} />
            {decodeName(name)}
          </div>
          <div className={styles.navs}>
            {!isSearching ? (
              <button className={styles.btn} onClick={handleFindNext}>
                Find Next
              </button>
            ) : (
              <button
                className={`${styles.btn} ${styles.endBtn}`}
                onClick={handleEndChat}
              >
                Stop
              </button>
            )}
          </div>
        </header>

        <main className={styles["msger-chat"]}>
          {onlineUsersNames.length > 1 &&
            anotherUserName()?.map((userName, index) => (
              <h1 key={index}>{`${decodeName(userName)} joined the chat.`}</h1>
            ))}
          {isSearching ? <h1>Searching for another user...</h1> : null}
          {messages.map((message, index) => (
            <div className={styles.messages} key={index}>
              {message.senderId === id ? (
                <div className={`${styles.msg} ${styles["right-msg"]}`}>
                  <div className={styles["msg-bubble"]}>
                    <div className={styles["msg-text"]}>{message?.message}</div>
                    <div className={styles["msg-time"]}>
                      {formatTimestamp(message?.timestamp)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.msg} ${styles["left-msg"]}`}>
                  <div className={styles["msg-bubble"]}>
                    <div className={styles["msg-text"]}>{message?.message}</div>
                    <div className={styles["msg-time"]}>
                      {formatTimestamp(message?.timestamp)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>

        {isOtherJoined ? (
          <form className={styles["msger-inputarea"]} autoComplete="off">
            <input
              type="text"
              className={styles["msger-input"]}
              placeholder="Type your message..."
              value={msg}
              onChange={handleMsgChange}
              onKeyDown={handleKeyDown}
            />
            <FaHeart className={styles.heart} onClick={handleSendEmogi} />
          </form>
        ) : isSearching ? null : (
          <div className={styles.disconnected}>
            <p>You are Disconnected !</p>{" "}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatDashboard;
