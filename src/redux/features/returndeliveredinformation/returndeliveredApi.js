import { api } from "../../api/apiSlice";

const returndeliveredApi = api.injectEndpoints({
    endpoints: (builder) => ({
      getAllReturnDeliveredInformation: builder.query({
        query: () => "/return-deliver",
        providesTags: ["insertdeliveryorderinfo","deletereturndeliveredinfo"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      insertReturnDeliveredInformation: builder.mutation({
        query: (payload) => ({
          url: "/return-deliver",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["insertdeliveryorderinfo"],
        transformResponse: (response, meta) => ({
          data: response,
          status: meta.response.status,
        }),
      }),
      getReturnDelivredInformationById: builder.query({
        query: (id) => {
          if (id) {
            return `/return-deliver/${id}`;
          } else {
            throw new Error("DeliveryOrder id is required");
          }
        },
      }),
      deleteReturnDeliveredInformation: builder.mutation({
        query: (id) => ({
          url: `/return-deliver/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["deletereturndeliveredinfo"],
        transformResponse: (response, meta) => ({
          data: response,
          status: meta.response.status,
        }),
      }),
    }),
});

export const {
useGetAllReturnDeliveredInformationQuery,
useInsertReturnDeliveredInformationMutation,
useGetReturnDelivredInformationByIdQuery,
useDeleteReturnDeliveredInformationMutation
} = returndeliveredApi;