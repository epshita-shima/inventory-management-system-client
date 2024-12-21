import { api } from "../../api/apiSlice";

const useroleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserRole: builder.query({
      query: () => "/api/v1/userrole",
    }),
    addNewUserRole: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/userrole",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});
export const { useGetUserRoleQuery, useAddNewUserRoleMutation } = useroleApi;
