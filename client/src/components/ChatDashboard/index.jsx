import React, { useContext, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import styles from "./ChatDashboard.module.scss";
import { Link } from "react-router-dom";
import userIcon from "../../assets/male.png";
import logo from "../../assets/brand.png";
import formatTimestamp from "../../utils/functions/timestamp";
import { decodeName } from "../../utils/functions/NameManipulator";
import { handleEndChat } from "../../utils/functions/EndChatUtils";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import { handleFindNext } from "../../utils/functions/SearchUtils";
import { useChattingSocketEvents } from "../../utils/functions/SocketEvents";
import {
  handleKeyDown,
  handleSendEmogi,
} from "../../utils/functions/SendMessageUtils";

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
    // onlineUsersIds,
  } = useSelector((state) => state.userState);

  const [msg, setMsg] = useState("");

  // Function to scroll to the bottom of the messages when a new message is received
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
  const anotherUserName = () => {
    return onlineUsersNames.filter((userName) => userName !== name);
  };
  useChattingSocketEvents(socket, dispatch, roomId);

  const handleMsgChange = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className={styles.body}>
      <section className={styles.msger}>
        <header className={styles["msger-header"]}>
          <div className={styles.logo}>
            <Link to="/" onClick={() => handleEndChat(dispatch, socket)}>
              <img src={logo} alt="userIcon" className={styles.siteLogo} />
            </Link>
          </div>
          <div className={styles.joinedUser}>
            <img src={userIcon} alt="userIcon" className={styles.userIcon} />
            {decodeName(name)}
          </div>
          <div className={styles.navs}>
            {!isSearching ? (
              <button
                className={styles.btn}
                onClick={() => handleFindNext(dispatch, socket, name)}
              >
                Find Next
              </button>
            ) : (
              <button
                className={`${styles.btn} ${styles.endBtn}`}
                onClick={() => handleEndChat(dispatch, socket)}
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
              onKeyDown={(e) =>
                handleKeyDown(e, socket, name, id, msg, roomId, setMsg)
              }
            />
            <FaHeart
              className={styles.heart}
              onClick={(e) => handleSendEmogi(e, socket, name, id, roomId)}
            />
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
