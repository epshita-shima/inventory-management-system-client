import { api } from "../../api/apiSlice";

const allreportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/report/order-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getOrderSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/report/order-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getSalesDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/report/sales-details",
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
    getReturnDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/report/return-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getReturnSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/report/return-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  })
})
export const {
  useLazyGetOrderDetailsReportQuery,
  useLazyGetOrderSummaryReportQuery,
  useLazyGetSalesDetailsReportQuery,
  useLazyGetSalesSummaryReportQuery,
  useLazyGetReturnDetailsReportQuery,
  useLazyGetReturnSummaryReportQuery
}=allreportApi