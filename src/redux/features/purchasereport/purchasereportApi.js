import { api } from "../../api/apiSlice";

const purchasereportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/purchase-report/details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getPurchaseSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/purchase-report/summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  })
})

export const {
useLazyGetPurchaseDetailsReportQuery,
useLazyGetPurchaseSummaryReportQuery
} = purchasereportApi