import { api } from "../../api/apiSlice";

const purchaseOrderInfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchaseOrderInformation: builder.query({
      query: () => "/api/v1/purchaseorderinfo",
      providesTags: [
        "insertpurchaseorderinfo",
        "updatepurchaseorderinfo",
        "purchaseorderinfostatus",
        "deletepurchaseorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
    getAllPurchaseOrderCashInformation: builder.query({
      query: () => "/api/v1/purchaseorderinfo/cash",
      providesTags: [
        "insertpurchaseorderinfo",
        "updatepurchaseorderinfo",
        "purchaseorderinfostatus",
        "deletepurchaseorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
    getAllPurchaseOrderLCInformation: builder.query({
      query: () => "/api/v1/purchaseorderinfo/lc",
      providesTags: [
        "insertpurchaseorderinfo",
        "updatepurchaseorderinfo",
        "purchaseorderinfostatus",
        "deletepurchaseorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
    getAllPurchaseOrderApproveInformation: builder.query({
      query: () => "/api/v1/purchaseorderinfo/approve",
      providesTags: [
        "insertpurchaseorderinfo",
        "updatepurchaseorderinfo",
        "purchaseorderinfostatus",
        "deletepurchaseorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
    getAllPurchaseOrderUnapproveInformation: builder.query({
      query: () => "/api/v1/purchaseorderinfo/unapprove",
      providesTags: [
        "insertpurchaseorderinfo",
        "updatepurchaseorderinfo",
        "purchaseorderinfostatus",
        "deletepurchaseorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertPurchaseOrderInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/purchaseorderinfo",
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
          return `/api/v1/purchaseorderinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    updatePurchaseOrderInformation: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/purchaseorderinfo/${payload._id}`,
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
        url: "/api/v1/purchaseorderinfo",
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
        url: `/api/v1/purchaseorderinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletepurchaseorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {
  useGetAllPurchaseOrderInformationQuery,
  useGetAllPurchaseOrderCashInformationQuery,
  useGetAllPurchaseOrderLCInformationQuery,
  useGetAllPurchaseOrderApproveInformationQuery,
  useGetAllPurchaseOrderUnapproveInformationQuery,
  useInsertPurchaseOrderInformationMutation,
  useGetSinglePurchaseOrderInformationQuery,
  useUpdatePurchaseOrderInformationMutation,
  useUpdatePurchaseOrderInformationStatusMutation,
  useDeletePurchaseOrderInformationMutation,
} = purchaseOrderInfoApi;
