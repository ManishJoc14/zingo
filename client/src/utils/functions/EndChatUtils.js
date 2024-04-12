import {
  setSearchStatus,
  setLoadingStatus,
  // setName,
  // setId,
  setRoomId,
  // setOnlineUsersNames,
  // setOnlineUsersIds,
  // resetMessages,
  setDisconnectingStatus,
  setIsOtherJoined,
} from "../../redux/userSlice";

export const handleEndChat = (e, dispatch, socket) => {
  e.preventDefault();
  socket.disconnect();
  socket.connect();
  dispatch(setRoomId(null));
  dispatch(setLoadingStatus(false));
  dispatch(setDisconnectingStatus(true));
  dispatch(setIsOtherJoined(false));
  dispatch(setSearchStatus(false));
};
