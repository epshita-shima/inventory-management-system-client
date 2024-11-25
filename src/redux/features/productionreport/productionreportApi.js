import { api } from "../../api/apiSlice";

const productionreportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductionDatewiseDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/production-report/datewise-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  })
})

export const {useLazyGetProductionDatewiseDetailsReportQuery}=productionreportApi