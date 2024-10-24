import { api } from "../../api/apiSlice";

const returndeliveredApi = api.injectEndpoints({
    endpoints: (builder) => ({
      getAllReturnDeliveredInformation: builder.query({
        query: () => "/return-deliver",
        providesTags: ["insertdeliveryorderinfo"],
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
      
    }),
});

export const {
useGetAllReturnDeliveredInformationQuery,
useInsertReturnDeliveredInformationMutation
} = returndeliveredApi;