import { api } from "../../api/apiSlice";

const consumptionreportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConsumptionReport: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/consupmtion-report",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  }),
})

export const {useLazyGetConsumptionReportQuery}=consumptionreportApi