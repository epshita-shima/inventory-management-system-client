import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authActions, logout } from "./authSlice";
import { scheduleTokenRefresh } from "./scheduleTokenRefresh";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";
import isTokenExpired from "./isTokenExpired";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log('url',`${process.env.REACT_APP_BASE_URL}`)
  console.log('args',args);
  console.log('api',api);
  console.log('extraOptions',extraOptions)
  const accessToken1 = localStorage.getItem("accesstoken");
  console.log('accessToken12',accessToken1)
  if (accessToken1) {
    if (isTokenExpired(accessToken1)) {
      const refreshResult = await baseQuery(
        {
          url: "/api/v2/jwt/refresh-token",
          method: "POST",
          body: {},
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newToken = refreshResult.data.token;
        localStorage.setItem("accesstoken", newToken);
        api.dispatch(authActions.setToken(newToken));
        scheduleTokenRefresh(newToken, api.dispatch);

        result = await baseQuery(args, api, extraOptions);
      } else if (refreshResult.error) {
        swal(
          "Somthing went wrong!",
          `${refreshResult.error.data.message}`,
          "warning"
        ).then(() => {
          localStorage.clear("accesstoken");
          localStorage.clear("user");
          window.location.href = "/";
        });

        api.dispatch(authActions.logout());
      }
    } else {
      console.log("Token is valid.");
    }
  } else {
    swal("Somthing went wrong!", `Please Login Again`, "warning").then(() => {
      localStorage.clear("accesstoken");
      localStorage.clear("user");
      window.location.href = "/";
    });
    api.dispatch(authActions.logout());
    console.log("No access token found.");
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
    getUser: builder.query({
      query: () => "/getuser",
    }),
  }),
});

export const {
  useAddNewUserMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
} = api;
