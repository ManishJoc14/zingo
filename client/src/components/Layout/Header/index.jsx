import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import logo from "../../../assets/brand.png";
import { useNavigate } from "react-router-dom";
import userIcon from "../../../assets/male.png";


const Header = ({ pathname }) => {
  // defined hooks
  const navigate = useNavigate();

  // state
  const [scrolled, setScrolled] = useState(false);
  const [showTalkBtn, setShowTalkBtn] = useState(true);

  // get users data from localstorage
  const usersData = JSON.parse(localStorage.getItem("userData"));
  
  const handleTalkToStrangers = () => {
    const hasUserData = JSON.parse(localStorage.getItem("userData"));
    if (hasUserData) {
      navigate("/start-searching");
    } else {
      navigate("/starter");
    }
  };

  //handle next buttton click
  const handleNext = () => {
  };


  const handleEnd = () => {
  
  };

  useEffect(() => {
    setShowTalkBtn(
      pathname === "/chat-dashboard" ||
        pathname === "/start-searching" ||
        pathname === "/starter"
    );
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <a href="/">
        <img src={logo} alt="Zingo" className={styles.logo} />
      </a>

      {pathname === "/chat-dashboard" && (
        <div className={styles.joinedUser}>
          <img src={userIcon} alt="userIcon" className={styles.userIcon} />
          user2
        </div>
      )}

      {!showTalkBtn && (
        <button
          href="/starter"
          className={styles.talkBtn}
          onClick={handleTalkToStrangers}
        >
          Talk To Strangers
        </button>
      )}

      {pathname === "/chat-dashboard" && (
        <div className={styles.buttons}>
          <button className={styles.talkBtn} onClick={handleNext}>
            {/* {loading && isNext ? "searching..." : "Next"} */}
          </button>
          <button
            className={`${styles.talkBtn} ${styles.endBtn}`}
            onClick={handleEnd}
          >
            {/* {disconnecting ? "disconnecting..." : "End"} */}
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
