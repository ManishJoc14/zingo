import React, { useCallback, useEffect, useState } from "react";
import styles from "./Searching.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RiUserSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const Searching = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const usersData = JSON.parse(localStorage.getItem("userData"));

  const handleSearch = () => {};

  const handleStopSearching = () => {};

  return (
    <div className={styles.main}>
      <p className={styles.usersName}>Hii {usersData?.nickName} !! </p>
      {isSearching ? (
        <>
          <Loader isInbutton={true} />
          <button
            onClick={handleStopSearching}
            className={styles.searchingPage}
          >
            stop Searching
          </button>
        </>
      ) : (
        <>
          <button onClick={handleSearch} className={styles.searchingPage}>
            Start Searching <RiUserSearchLine />
          </button>
        </>
      )}
    </div>
  );
};

export default Searching;
