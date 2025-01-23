import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authActions, logout } from "./authSlice";
import { scheduleTokenRefresh } from "./scheduleTokenRefresh";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = localStorage.getItem("accesstoken");
    console.log("accessToken", accessToken);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("result", result?.error?.status);
  if (result?.error && result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/api/v2/jwt/refresh-token",
        method: "POST",
        body: {},
      },
      api,
      extraOptions
    );
    console.log(refreshResult);
    if (refreshResult.data) {
      const newToken = refreshResult.data.token;
      localStorage.setItem("accesstoken", newToken);
      api.dispatch(authActions.setToken(newToken));
      scheduleTokenRefresh(newToken, api.dispatch);

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(authActions.logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["createuser", "changestatus", "changesmanytatus", "deleteuser"],
  endpoints: (builder) => ({
    addNewUser: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/api/v2/jwt/refresh-token",
        method: "POST",
      }),
    }),
    userLogin: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),
    getUser: builder.query({
      query: () => "/getuser",
    }),
  }),
});

export const {
  useAddNewUserMutation,
  useUserLoginMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
} = api;
