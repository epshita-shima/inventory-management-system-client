import { api } from "../../api/apiSlice";

const purchaseOrderInfoApi= api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchaseOrderInformation: builder.query({
        query: () => "/purchaseorderinfo",
        providesTags: ["insertpurchaseorderinfo","updatepurchaseorderinfo","purchaseorderinfostatus","deletepurchaseorderinfo"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      
    insertPurchaseOrderInformation: builder.mutation({
      query: (payload) => ({
        url: "/purchaseorderinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertpurchaseorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    getSinglePurchaseOrderInformation: builder.query({
      query: (id) => {
        if (id) {
          return `/purchaseorderinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    updatePurchaseOrderInformation: builder.mutation({
      query: (payload) => ({
        url: `/purchaseorderinfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updatepurchaseorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updatePurchaseOrderInformationStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/purchaseorderinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["purchaseorderinfostatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deletePurchaseOrderInformation: builder.mutation({
      query: (id) => ({
        url: `/purchaseorderinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletepurchaseorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      })
    }),
  }),
});

export const {useGetAllPurchaseOrderInformationQuery,useInsertPurchaseOrderInformationMutation,
  useGetSinglePurchaseOrderInformationQuery,
  useUpdatePurchaseOrderInformationMutation,
  useUpdatePurchaseOrderInformationStatusMutation,
  useDeletePurchaseOrderInformationMutation}=purchaseOrderInfoApi