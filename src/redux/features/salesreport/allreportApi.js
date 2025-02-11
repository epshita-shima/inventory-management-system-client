import { api } from "../../api/apiSlice";

const allreportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/order-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getOrderSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/order-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getSalesDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/sales-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getSalesSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/sales-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getReturnDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/return-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getReturnSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/return-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getCombineReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/report/combine",
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
  useLazyGetReturnSummaryReportQuery,
  useLazyGetCombineReportQuery
}=allreportApi