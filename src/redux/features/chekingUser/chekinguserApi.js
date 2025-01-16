import { api } from "../../api/apiSlice";

const chekinguserApi= api.injectEndpoints({
  endpoints: (builder) => ({
    insertUserLogin: builder.mutation({
      query: (payload) => ({
        url: "/jwt",
        method: "POST",
        body: payload,
      }),
    }),
    userLoggedOut: builder.mutation({
      query: (payload) => ({
        url: "/jwt/logout",
        method: "POST",
      }),
    }),
  }),
});
export const { useInsertUserLoginMutation,useUserLoggedOutMutation} = chekinguserApi;