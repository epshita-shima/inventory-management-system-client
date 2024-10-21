import { api } from "../../api/apiSlice";

const deliveryinfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllDelieryOrderInformation: builder.query({
      query: () => "/delivery-order",
      providesTags: ["insertdeliveryorderinfo", "updatedeliveryorderinfo","changdeliveryorderapprove","deletedeliveryorderinfo"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    getSingleDeliveryOrderInformation: builder.query({
      query: (id) => {
        if (id) {
          return `/delivery-order/${id}`;
        } else {
          throw new Error("DeliveryOrder id is required");
        }
      },
    }),

    getFilteredDeliveryOrder: builder.query({
      query: (queryParams) => ({
        url: 'delivery-order/filtered',
        params: queryParams,
        providesTags: ["insertdeliveryorderinfo", "updatedeliveryorderinfo,deletedeliveryorderinfo"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
      }),
    }),
    insertDeliveryOrderInformation: builder.mutation({
      query: (payload) => ({
        url: "/delivery-order",
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
        url: `/delivery-order/${payload._id}`,
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
        url: "/delivery-order/approve-status",
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
        url: `/delivery-order/${id}`,
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
  useInsertDeliveryOrderInformationMutation,
  useGetSingleDeliveryOrderInformationQuery,
  useLazyGetFilteredDeliveryOrderQuery,
  useUpdateDeliveryOrderInformationMutation,
  useUpdateDeliveryOrderApproveStatusMutation,
  useDeleteDeliveryOrderInformationMutation,
} = deliveryinfoApi;
