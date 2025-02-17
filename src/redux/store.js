import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice"
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from "./api/apiSlice";

const store = configureStore({
  reducer: {
    user:userReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});
setupListeners(store.dispatch);
export default store;
