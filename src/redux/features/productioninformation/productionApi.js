import { api } from "../../api/apiSlice";

const productionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductionInformation: builder.query({
      query: () => "/production",
      providesTags: [
        "insertproductioninfo",
        "updateproductioninfo,deleteproductioninfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getSingleProductionInformation: builder.query({
      query: (id) => {
        if (id) {
          return `/production/${id}`;
        } else {
          throw new Error("production id is required");
        }
      },
    }),
    getFilteredProductionInfo: builder.query({
      query: (queryParams) => ({
        url: "production/filtered",
        params: queryParams,
        providesTags: [
          "insertproductioninfo",
          "updateproductioninfo,deleteproductioninfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    updateProductionInformation: builder.mutation({
      query: (payload) => ({
        url: `/production/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updateproductioninfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    insertProductionInformation: builder.mutation({
      query: (payload) => ({
        url: "/production",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertproductioninfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteProductionInformation: builder.mutation({
      query: (id) => ({
        url: `/production/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteproductioninfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {
  useGetAllProductionInformationQuery,
  useGetSingleProductionInformationQuery,
  useLazyGetFilteredProductionInfoQuery,
  useGetFilteredProductionInfoQuery,
  useInsertProductionInformationMutation,
  useUpdateProductionInformationMutation,
  useDeleteProductionInformationMutation,
} = productionApi;
