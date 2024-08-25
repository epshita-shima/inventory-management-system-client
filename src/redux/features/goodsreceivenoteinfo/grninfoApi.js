import { api } from "../../api/apiSlice";

const grninfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllGRNInformation: builder.query({
      query: () => "/grninfo",
      providesTags: ["insertgrninfo", "updategrninfo,deletegrninfo"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getSingleGRNInformation: builder.query({
      query: (id) => {
        if (id) {
          return `/grninfo/${id}`;
        } else {
          throw new Error("GRN id is required");
        }
      },
    }),
    getFilteredGRN: builder.query({
      query: (queryParams) => ({
        url: 'grninfo/filtered',
        params: queryParams,
        providesTags: ["insertgrninfo", "updategrninfo,deletegrninfo"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
      }),
    }),

    updateGRNInformation: builder.mutation({
      query: (payload) => ({
        url: `/grninfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updategrninfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    insertGRNInformation: builder.mutation({
      query: (payload) => ({
        url: "/grninfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertgrninfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteGRNInformation: builder.mutation({
      query: (id) => ({
        url: `/grninfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletegrninfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {
  useGetAllGRNInformationQuery,
  useLazyGetFilteredGRNQuery,
  useInsertGRNInformationMutation,
  useGetSingleGRNInformationQuery,
  useUpdateGRNInformationMutation,
  useDeleteGRNInformationMutation,
} = grninfoApi;
