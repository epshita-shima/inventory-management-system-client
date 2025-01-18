import { api } from "../../api/apiSlice";

const rmItemInfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRMItemInformation: builder.query({
      query: () => "/api/v1/rawmaterialinfo",
      providesTags: ["insertiteminfo", "updateiteminfo","deleteiteminfo","changesitemtatus"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertRMItemInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/rawmaterialinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertiteminfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleRMItem: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/rawmaterialinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),

    updateRMItemInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/rawmaterialinfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updateiteminfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    updateRawMaterialStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/rawmaterialinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changesitemtatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    deleteRMItemInfo: builder.mutation({
      query: (id) => ({
        url: `/api/v1/rawmaterialinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteiteminfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      })
    
    }),
  }),
});

export const {
useGetAllRMItemInformationQuery,
useInsertRMItemInformationMutation,
useGetSingleRMItemQuery,
useUpdateRMItemInfoMutation,
useUpdateRawMaterialStatusMutation,
useDeleteRMItemInfoMutation
} = rmItemInfoApi;
