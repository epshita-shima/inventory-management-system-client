import { api } from "../../api/apiSlice";

const invoiceinfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvoiceInformation: builder.query({
      query: () => "/invoiceinfo",
      providesTags: [
        "insertinvoiceinfo",
        "updateinvoiceinfo",
        "changeinvoicestatus",
        "changeinvoiceshipment",
        "deleteinvoiceinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertInvoiceInformation: builder.mutation({
      query: (payload) => ({
        url: "/invoiceinfo",
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
          return `/invoiceinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),

    getFilteredInvoiceInfo: builder.query({
      query: (queryParams) => ({
        url: "invoiceinfo/filtered",
        params: queryParams,
        providesTags: [
          "insertinvoiceinfo",
          "updateinvoiceinfo",
          "changeinvoicestatus",
          "changeinvoicespecialapprove",
          "deleteinvoiceinfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    updateInvoiceInfo: builder.mutation({
      query: (payload) => ({
        url: `/invoiceinfo/${payload._id}`,
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
        url: "/invoiceinfo/special-approve",
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
        url: "/invoiceinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changeinvoicestatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateInvoiceShipment: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/invoiceinfo/shipment",
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
        url: `/invoiceinfo/${id}`,
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
  useGetSingleInvoiceQuery,
  useUpdateInvoiceInfoMutation,
  useUpdateInvoiceStatusMutation,
  useUpdateInvoiceSpecialPIApproveStatusMutation,
  useUpdateInvoiceShipmentMutation,
  useDeleteInvoiceInfoMutation,
  useLazyGetFilteredInvoiceInfoQuery,
} = invoiceinfoApi;
