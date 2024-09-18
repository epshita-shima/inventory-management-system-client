import { api } from "../../api/apiSlice";

const paymentreceiveApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPaymentReceiveInformation: builder.query({
      query: () => "/payment-receive",
      providesTags: [
        "insertpaymentreceiveinfo",
        "updatepaymentreceiveinfo",
        "changepaymentreceivestatus",
        "deletepaymentreceiveinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertPaymentReceiveInformation: builder.mutation({
      query: (payload) => ({
        url: "/payment-receive",
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
          return `/payment-receive/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    getFilteredPaymentReceiveInfo: builder.query({
      query: (queryParams) => ({
        url: "payment-receive/filtered",
        params: queryParams,
        providesTags: [
          "insertpaymentreceiveinfo",
          "updatepaymentreceiveinfo,deletepaymentreceiveinfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    updatePaymentReceiveInfo: builder.mutation({
      query: (payload) => ({
        url: `/payment-receive`,
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
      query: (id) => ({
        url: `/payment-receive/${id}`,
        method: "DELETE",
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
  useInsertPaymentReceiveInformationMutation,
  useGetSinglePaymentReceiveQuery,
  useLazyGetFilteredPaymentReceiveInfoQuery,
  useUpdatePaymentReceiveInfoMutation,
  useDeletepaymentreceiveInfoMutation,
} = paymentreceiveApi;
