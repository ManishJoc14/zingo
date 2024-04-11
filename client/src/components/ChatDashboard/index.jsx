import React, { useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import styles from "./ChatDashboard.module.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userIcon from "../../assets/male.png";
import logo from "../../assets/brand.png";
import formatTimestamp from "../../utils/functions/timestamp";

const ChatDashboard = () => {
  // defined hooks
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // custom states
  const [msg, setMsg] = useState("");
  const [disconnected, setDisconnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const usersData = JSON.parse(localStorage.getItem("userData"));

  // Function to scroll to the bottom of the messages when a new message is received
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const handleSend = (e) => {
   
  };

  const handleKeyDown = (e) => {
    if (e && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMsg("");
      handleSend(e);
    }
  };

  const handleSendEmogi = (e) => {
    e.preventDefault();
    
  };

  const handleEndChat = (e) => {
    e.preventDefault();
  };


  const handleFindNext = () => {
    navigate("/start-searching");
    window.location.reload();
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
           user2
          </div>
          <div className={styles.navs}>
            {disconnected ? (
              <button className={styles.btn} onClick={handleFindNext}>
                Find Next
              </button>
            ) : (
              <button
                className={`${styles.btn} ${styles.endBtn}`}
                onClick={handleEndChat}
              >
                End
              </button>
            )}
          </div>
        </header>

        <main className={styles["msger-chat"]}>
          <h1>{`$User2 joined the chat.`}</h1>
          {messages?.payload?.messages?.map((message, index) => (
            <div className={styles.messages} key={index}>
              {message?.initiator === usersData.userId ? (
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

        {!disconnected ? (
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
        ) : (
          <div className={styles.disconnected}>
            <p>You are Disconnected !</p>{" "}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatDashboard;
