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
  }),
});
export const { useInsertUserLoginMutation} = chekinguserApi;