import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
