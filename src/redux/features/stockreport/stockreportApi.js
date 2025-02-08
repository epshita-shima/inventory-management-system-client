import { api } from "../../api/apiSlice";

const stockreportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRawMaterialStockReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/stock-report/raw--material-stock-report",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    })
  })})
    export const {
     useLazyGetRawMaterialStockReportQuery

    }=stockreportApi