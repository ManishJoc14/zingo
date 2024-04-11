// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    userDetails: userReducer,
  },
});

export default store;