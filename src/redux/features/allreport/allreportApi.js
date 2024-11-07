import { api } from "../../api/apiSlice";

const allreportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/report/order-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getSalesSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/report/sales-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  })
})
export const {
  useLazyGetOrderSummaryReportQuery,
  useLazyGetSalesSummaryReportQuery,
}=allreportApi