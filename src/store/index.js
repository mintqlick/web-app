// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import statusReducer from "./slices/status"; // ✅ default import of the reducer

export const store = configureStore({
  reducer: {
    status: statusReducer, // ✅ now it's a valid reducer
  },
});

export const useAppDispatch = () => useDispatch();
