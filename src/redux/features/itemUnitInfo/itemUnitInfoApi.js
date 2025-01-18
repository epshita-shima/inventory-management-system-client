import { api } from "../../api/apiSlice";

const itemUnitInfoApi= api.injectEndpoints({
  endpoints: (builder) => ({
    getAllItemUnit: builder.query({
        query: () => "/api/v1/itemunit",
        providesTags: ["insertitemunit"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      
    insertItemUnit: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/itemunit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertitemunit"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {useGetAllItemUnitQuery,useInsertItemUnitMutation}= itemUnitInfoApi