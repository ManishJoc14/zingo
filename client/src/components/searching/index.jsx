import React, { useContext, useEffect } from "react";
import styles from "./Searching.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RiUserSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import io from "socket.io-client";

import {
  setSearchStatus,
  setLoadingStatus,
  setName,
  setId,
  setRoomId,
  setOnlineUsersNames,
  setOnlineUsersIds,
  resetMessages,
  setDisconnectingStatus,
  setIsOtherJoined,
} from "../../redux/userSlice";
import { decodeName } from "../../utils/functions/NameManipulator";
import { SocketContext } from "../../context/SocketContext";
// const socket = io("http://localhost:3001");

const Searching = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const socket = useContext(SocketContext);

  const {
    name,
    id,
    // messages,
    // error,
    // isLoading,
    // isDisconnecting,
    // onlineUsersNames,
    // onlineUsersIds,
    isSearching,
    isOtherJoined,
  } = useSelector((state) => state.userState);

  const handleSearch = () => {
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

  useEffect(() => {
    socket.on("room_joined", ({ roomId }) => {
      dispatch(setRoomId(roomId));
    });
    socket.on("online_users_room", ({ userIds, userNames }) => {
      dispatch(setOnlineUsersNames(userNames));
      dispatch(setOnlineUsersIds(userIds));
      const index = userNames.indexOf(name);
      dispatch(setId(userIds[index]));
    });

    socket.on("other_user_joined", () => {
      dispatch(setIsOtherJoined(true));
      dispatch(setSearchStatus(false));
      dispatch(setLoadingStatus(false));
      dispatch(setDisconnectingStatus(false));
      navigation("/chat-dashboard");
    });
  }, [name, socket, dispatch, navigation]);

  const handleStopSearching = () => {
    socket.disconnect();
    socket.connect();
    dispatch(setId(null));
    dispatch(setRoomId(null));
    dispatch(resetMessages());
    dispatch(setLoadingStatus(false));
    dispatch(setDisconnectingStatus(true));
    dispatch(setIsOtherJoined(false));
    dispatch(setSearchStatus(false));
  };

  return (
    <div className={styles.main}>
      <p className={styles.usersName}>Hii {decodeName(name)} !! </p>
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
