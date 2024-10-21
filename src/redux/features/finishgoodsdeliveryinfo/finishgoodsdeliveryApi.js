import { api } from "../../api/apiSlice";

const finishgoodsdeliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllFinishGoodsDeliveryInformation: builder.query({
      query: () => "/finish-goods-delivery",
      providesTags: [
        "insertfinishgoodsdeliveryinfo",
        "updatefinishgoodsdeliveryinfo",
        "changefinishgoodsdeliverystatus",
        "deletefinishgoodsdeliveryinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getFilteredFinishGoodsDeliveryInfo: builder.query({
      query: (queryParams) => ({
        url: "finish-goods-delivery/filtered",
        params: queryParams,
        providesTags: [
          "insertfinishgoodsdeliveryinfo",
          "updatefinishgoodsdeliveryinfo,deletefinishgoodsdeliveryinfo",
        ],

        keepUnusedDataFor: 600,
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    insertFinishGoodsDeliveryInformation: builder.mutation({
      query: (payload) => ({
        url: "/payment-receive",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertfinishgoodsdeliveryinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deletefinishgoodsdeliveryInfo: builder.mutation({
      query: (payload) => ({
        url: `/payment-receive`,
        method: "DELETE",
        body:payload
      }),
      invalidatesTags: ["deletefinishgoodsdeliveryinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});
export const {
useGetAllFinishGoodsDeliveryInformationQuery,
useLazyGetFilteredFinishGoodsDeliveryInfoQuery,
} = finishgoodsdeliveryApi;
