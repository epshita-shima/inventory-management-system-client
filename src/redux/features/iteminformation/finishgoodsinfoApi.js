import { api } from "../../api/apiSlice";

const iteminfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllItemInformation: builder.query({
      query: () => "/api/v1/finishgoodsinfo",
      providesTags: ["insertiteminfo", "updateiteminfo","changesitemtatus","deleteiteminfo"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertItemInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/finishgoodsinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertiteminfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleItem: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/finishgoodsinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),

    updateItemInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/finishgoodsinfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updateiteminfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateFinishGoodStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/finishgoodsinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changesitemtatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    
    deleteItemInfo: builder.mutation({
      query: (id) => ({
        url: `/api/v1/finishgoodsinfo/${id}`,
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
  useGetAllItemInformationQuery,
  useInsertItemInformationMutation,
  useGetSingleItemQuery,
  useUpdateItemInfoMutation,
  useUpdateFinishGoodStatusMutation,
  useDeleteItemInfoMutation
} = iteminfoApi;
