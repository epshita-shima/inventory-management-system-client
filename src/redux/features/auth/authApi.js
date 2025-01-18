import { api } from "../../api/apiSlice";

const authApi= api.injectEndpoints({
  endpoints: (builder) => ({
    insertUserLogin: builder.mutation({
      query: (payload) => ({
        url: "/api/v2/jwt",
        method: "POST",
        body: payload,
      }),
    }),
    userLoggedOut: builder.mutation({
      query: () => ({
        url: "/api/v2/jwt/logout",
        method: "POST",
      }),
    }),
  }),
});
export const { useInsertUserLoginMutation,useUserLoggedOutMutation} = authApi;