import { useEffect } from "react";
import {
  setSearchStatus,
  setLoadingStatus,
//   setName,
  setId,
  setRoomId,
  setOnlineUsersNames,
  setOnlineUsersIds,
  setMessages,
//   resetMessages,
  setDisconnectingStatus,
  setIsOtherJoined,
} from "../../redux/userSlice";

export const useSearchingSocketEvents = (
  socket,
  dispatch,
  name,
  navigation
) => {
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
};

export const useChattingSocketEvents = (socket, dispatch, roomId) => {
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
};
