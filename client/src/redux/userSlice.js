import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    name: null,
    id: null,
    messages: [],
    roomId: null,
    error: null,
    onlineUsersNames: [],
    onlineUsersIds: [],
    isSearching: false,
    isLoading: false,
    isDisconnecting: false,
    isOtherJoined: false,
  },
  reducers: {
    setSearchStatus: (state, action) => {
      state.isSearching = action.payload;
    },
    setLoadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    resetMessages: (state) => {
      state.messages = [];
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setOnlineUsersNames: (state, action) => {
      state.onlineUsersNames = [...action.payload];
    },
    setOnlineUsersIds: (state, action) => {
      state.onlineUsersIds = [...action.payload];
    },
    setDisconnectingStatus: (state, action) => {
      state.isDisconnecting = action.payload;
    },
    setIsOtherJoined: (state, action) => {
      state.isOtherJoined = action.payload;
    },
  },
});

export const {
  setSearchStatus,
  setLoadingStatus,
  setName,
  setId,
  setRoomId,
  setMessages,
  setOnlineUsersNames,
  setOnlineUsersIds,
  resetMessages,
  setDisconnectingStatus,
  setIsOtherJoined,
} = userSlice.actions;
export default userSlice.reducer;
