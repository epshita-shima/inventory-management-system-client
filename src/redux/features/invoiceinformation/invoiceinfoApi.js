import { api } from "../../api/apiSlice";

const invoiceinfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvoiceInformation: builder.query(
      {
      query: () => "/api/v1/invoiceinfo",
      providesTags: [
        "insertinvoiceinfo",
        "updateinvoiceinfo",
        "changeinvoicestatus",
        "changeinvoiceshipment",
        "changeinvoicedeliveredqty",
        "deleteinvoiceinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  ),

    insertInvoiceInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/invoiceinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertinvoiceinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleInvoice: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/invoiceinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),

    getFilteredInvoiceInfo: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/invoiceinfo/filtered",
        params: queryParams,
        providesTags: [
          "insertinvoiceinfo",
          "updateinvoiceinfo",
          "changeinvoicestatus",
          "changeinvoicespecialapprove",
          "changeinvoicedeliveredqty",
          "deleteinvoiceinfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getFilteredForReportInvoiceInfo: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report",
        params: queryParams,
        providesTags: [
          "insertinvoiceinfo",
          "updateinvoiceinfo",
          "changeinvoicestatus",
          "changeinvoicespecialapprove",
          "changeinvoicedeliveredqty",
          "deleteinvoiceinfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    updateInvoiceInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/invoiceinfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updateinvoiceinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }), 

    updateInvoiceSpecialPIApproveStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/invoiceinfo/special-approve",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changeinvoicespecialapprove"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateInvoiceStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/invoiceinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changeinvoicestatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateInvoiceDeliveredQty: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/invoiceinfo/update-delivered-qty",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changeinvoicedeliveredqty"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateInvoiceShipment: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/invoiceinfo/shipment",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changeinvoiceshipment"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteInvoiceInfo: builder.mutation({
      query: (id) => ({
        url: `/api/v1/invoiceinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deleteinvoiceinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {
  useGetAllInvoiceInformationQuery,
  useInsertInvoiceInformationMutation,
  useLazyGetFilteredForReportInvoiceInfoQuery,
  useGetSingleInvoiceQuery,
  useUpdateInvoiceInfoMutation,
  useUpdateInvoiceStatusMutation,
  useUpdateInvoiceSpecialPIApproveStatusMutation,
  useUpdateInvoiceShipmentMutation,
  useUpdateInvoiceDeliveredQtyMutation,
  useDeleteInvoiceInfoMutation,
  useLazyGetFilteredInvoiceInfoQuery,
} = invoiceinfoApi;
