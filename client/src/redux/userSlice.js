import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    name: "",
    id: "",
    error: null,
    isSearching: false,
    isLoading: false,
    isDisconnecting: false,
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
    setId: (state, action) => {
      state.id = action.payload;
    },
    setDisconnectingStatus: (state, action) => {
      state.isDisconnecting = action.payload;
    },
  },
});

export const {
  setSearchStatus,
  setLoadingStatus,
  setName,
  setId,
  setDisconnectingStatus,
} = userSlice.actions;
export default userSlice.reducer;
