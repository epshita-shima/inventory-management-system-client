import { api } from "../../api/apiSlice";

const clientInfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllClientInformation: builder.query({
      query: () => "/clientinfo",
      providesTags: ["insertclientinfo", "updateiclientinfo","deleteclientinfo","changesclientstatus"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertClientInformation: builder.mutation({
      query: (payload) => ({
        url: "/clientinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertclientinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleClientInfo: builder.query({
      query: (id) => {
        if (id) {
          return `/clientinfo/${id}`;
        } else {
          throw new Error("Client id is required");
        }
      },
    }),

    updateClientDetailsInfo: builder.mutation({
      query: (payload) => ({
        url: `/clientinfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updateiclientinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    
    updateClientInfoStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/clientinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changesclientstatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteClientInfo: builder.mutation({
      query: (id) => ({
        url: `/clientinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteclientinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      })
    }),
  }),
});

export const {
useGetAllClientInformationQuery,
useInsertClientInformationMutation,
useGetSingleClientInfoQuery,
useUpdateClientDetailsInfoMutation,
useUpdateClientInfoStatusMutation,
useDeleteClientInfoMutation
} = clientInfoApi;
