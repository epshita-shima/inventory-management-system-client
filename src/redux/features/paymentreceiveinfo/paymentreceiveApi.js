import { api } from "../../api/apiSlice";

const paymentreceiveApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPaymentReceiveInformation: builder.query({
      query: () => "/api/v1/payment-receive",
      providesTags: [
        "insertpaymentreceiveinfo",
        "updatepaymentreceiveinfo",
        "changepaymentreceivestatus",
        "deletepaymentreceiveinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
    getFilteredPaymentReceiveInfo: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/payment-receive/filtered",
        params: queryParams,
        providesTags: [
          "insertpaymentreceiveinfo",
          "updatepaymentreceiveinfo,deletepaymentreceiveinfo",
        ],

        keepUnusedDataFor: 600,
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    insertPaymentReceiveInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/payment-receive",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertpaymentreceiveinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSinglePaymentReceive: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/payment-receive/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),

    updatePaymentReceiveInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/payment-receive/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updatepaymentreceiveinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    updatePreviousPaymentReceiveInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/payment-receive`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updatepaymentreceiveinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deletepaymentreceiveInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/payment-receive`,
        method: "DELETE",
        body:payload
      }),
      invalidatesTags: ["deletepaymentreceiveinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});
export const {
  useGetAllPaymentReceiveInformationQuery,
  useLazyGetFilteredPaymentReceiveInfoQuery,
  useInsertPaymentReceiveInformationMutation,
  useGetSinglePaymentReceiveQuery,
  useUpdatePaymentReceiveInfoMutation,
  useUpdatePreviousPaymentReceiveInfoMutation,
  useDeletepaymentreceiveInfoMutation,
} = paymentreceiveApi;
