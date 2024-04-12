import {
  setSearchStatus,
  setLoadingStatus,
  setName,
  setId,
  setRoomId,
  // setOnlineUsersNames,
  // setOnlineUsersIds,
  resetMessages,
  setDisconnectingStatus,
  setIsOtherJoined,
} from "../../redux/userSlice";

export const handleSearch = (dispatch, socket, name) => {
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

export const handleStopSearching = (dispatch, socket) => {
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

export const handleFindNext = (dispatch, socket, name) => {
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
