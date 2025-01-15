import { api } from "../../api/apiSlice";

const finishgoodsdeliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllFinishGoodsDeliveryInformation: builder.query({
      query: () => "/finish-goods-delivery",
      providesTags: [
        "insertfinishgoodsdeliveryinfo",
        "updatefinishgoodsdeliveryinfo",
        "changefinishgoodsdeliverystatus",
       " changereturnstatus",
        "deletefinishgoodsdeliveryinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getFilteredFinishGoodsDeliveryInfo: builder.query({
      query: (queryParams) => ({
        url: "/finish-goods-delivery/filtered",
        params: queryParams,
        providesTags: [
          "insertfinishgoodsdeliveryinfo",
          "updatefinishgoodsdeliveryinfo","changereturnstatus","deletefinishgoodsdeliveryinfo",
        ],
        keepUnusedDataFor: 600,
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    insertFinishGoodsDeliveryInformation: builder.mutation({
      query: (payload) => ({
        url: "/finish-goods-delivery",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertfinishgoodsdeliveryinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleFinishGoodsDeliveryInformation: builder.query({
      query: (id) => {
        if (id) {
          return `/finish-goods-delivery/${id}`;
        } else {
          throw new Error("DeliveryOrder id is required");
        }
      },
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
useInsertFinishGoodsDeliveryInformationMutation,
useGetSingleFinishGoodsDeliveryInformationQuery
} = finishgoodsdeliveryApi;
