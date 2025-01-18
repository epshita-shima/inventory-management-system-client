import { api } from "../../api/apiSlice";

const deliveryinfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllDelieryOrderInformation: builder.query({
      query: () => "/api/v1/delivery-order",
      providesTags: [
        "insertdeliveryorderinfo",
        "updatedeliveryorderinfo",
        "changdeliveryorderapprove",
        "deletedeliveryorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getAllDelieryOrderInformationAfterDeliver: builder.query({
      query: () => "/api/v1/delivery-order/after-deliver",
      providesTags: [
        "insertdeliveryorderinfo",
        "updatedeliveryorderinfo",
        "changdeliveryorderapprove",
        "deletedeliveryorderinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getSingleDeliveryOrderInformation: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/delivery-order/${id}`;
        } else {
          throw new Error("DeliveryOrder id is required");
        }
      },
    }),

    getDeliveryOrderInfoForReturn: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/delivery-order/single-info",
        params: queryParams,
        providesTags: [
          "insertdeliveryorderinfo",
          "updatedeliveryorderinfo",
          "deletedeliveryorderinfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    getFilteredDeliveryOrder: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/delivery-order/filtered",
        params: queryParams,
        providesTags: [
          "insertdeliveryorderinfo",
          "updatedeliveryorderinfo",
          "deletedeliveryorderinfo",
        ],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),

    insertDeliveryOrderInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/delivery-order",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertdeliveryorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateDeliveryOrderInformation: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/delivery-order/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updatedeliveryorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateDeliveryOrderApproveStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/delivery-order/approve-status",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changdeliveryorderapprove"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteDeliveryOrderInformation: builder.mutation({
      query: (id) => ({
        url: `/api/v1/delivery-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletedeliveryorderinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {
  useGetAllDelieryOrderInformationQuery,
  useGetAllDelieryOrderInformationAfterDeliverQuery,
  useInsertDeliveryOrderInformationMutation,
  useGetSingleDeliveryOrderInformationQuery,
  useLazyGetDeliveryOrderInfoForReturnQuery,
  useLazyGetFilteredDeliveryOrderQuery,
  useUpdateDeliveryOrderInformationMutation,
  useUpdateDeliveryOrderApproveStatusMutation,
  useDeleteDeliveryOrderInformationMutation,
} = deliveryinfoApi;
