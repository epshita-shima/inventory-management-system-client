import { api } from "../../api/apiSlice";

const paymentInfoApi= api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPaymentInformation: builder.query({
        query: () => "/api/v1/paymentinfo",
        providesTags: ["insertpaymentinfo","deletepaymentinfo"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      
    insertPaymentInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/paymentinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertpaymentinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    deletePaymentInformation: builder.mutation({
      query: (id) => ({
        url: `/api/v1/paymentinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletepaymentinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {useGetAllPaymentInformationQuery,useInsertPaymentInformationMutation,useDeletePaymentInformationMutation}=paymentInfoApi;