import { api } from "../../api/apiSlice";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getAllUser: builder.query({
      query: () => "/users",
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
        url: "/users",
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
          return `/users/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    updateUser: builder.mutation({
      query: (updatedData) => ({
        url: `/users/update/${updatedData._id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["changestatus"],
    }),
    updateUserPassword: builder.mutation({
      query: (updatedData) => ({
        url: `/users/change/password/${updatedData._id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["changestatus"],
    }),
    updateMultipleUserStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/users/status/updateStatus",
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
        url: "/users/updatestatus/updateMultiple",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["updatedata"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
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
  useUpdateUserPasswordMutation
} = userApi;
