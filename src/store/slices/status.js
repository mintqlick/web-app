import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  canCommit: false,
  disabled: false,
};

export const StatusSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setCanCommit: (state, action) => {
      state.canCommit = action.payload; // ✅ just mutate, don't return
    },
    setDisabled: (state, action) => {
      state.disabled = action.payload; // ✅ just mutate
    },
  },
});

export const { setCanCommit, setDisabled } = StatusSlice.actions;
export default StatusSlice.reducer;
