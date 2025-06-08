import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../app/redux/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
