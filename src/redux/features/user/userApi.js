import { api } from "../../api/apiSlice";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => "/api/v1/users",
      onError: async (error) => {
        console.log("error", error);
        if (error.status === 401) {
          const refreshResponse = await fetch("/api/v2/refresh-token", {
            method: "POST",
            credentials: "include",
          });
          const data = await refreshResponse.json();
          const newAccessToken = data.token;
          console.log("newAccessToken", newAccessToken);
        }
      },
      providesTags: [
        "createuser",
        "updatedata",
        "changestatus",
        "deleteuser",
        "changesmanytatus",
      ],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["createuser"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    getSingleUser: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/users/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    updateUser: builder.mutation({
      query: (updatedData) => ({
        url: `/api/v1/users/update/${updatedData?._id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["changestatus"],
    }),
    updateUserPassword: builder.mutation({
      query: (updatedData) => ({
        url: `/api/v1/users/change/password/${updatedData?._id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["changestatus"],
    }),
    updateMultipleUserStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/users/status/updateStatus",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changesmanytatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateMultipleUserField: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/users/updatestatus/updateMultiple",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["updatedata"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/v1/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteuser"],
    }),
  }),
});
export const {
  useCreateUserMutation,
  useGetAllUserQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateMultipleUserStatusMutation,
  useUpdateMultipleUserFieldMutation,
  useUpdateUserPasswordMutation,
} = userApi;
