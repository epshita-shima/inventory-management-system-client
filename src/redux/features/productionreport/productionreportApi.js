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
    getProductionDatewiseSummaryReport: builder.query({
      query: (queryParams) => ({
        url: "/production-report/datewise-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getProductionItemwiseDetailsReport: builder.query({
      query: (queryParams) => ({
        url: "/production-report/itemwise-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getRawMaterialDetailsConsumptionReport: builder.query({
      query: (queryParams) => ({
        url: "/production-report/raw-material-consumption-details",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
    getRawMaterialSummaryConsumptionReport: builder.query({
      query: (queryParams) => ({
        url: "/production-report/raw-material-consumption-summary",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  }),
});

export const {
  useLazyGetProductionDatewiseDetailsReportQuery,
  useLazyGetProductionDatewiseSummaryReportQuery,
  useGetProductionItemwiseDetailsReportQuery,
  useLazyGetRawMaterialDetailsConsumptionReportQuery,
useLazyGetRawMaterialSummaryConsumptionReportQuery
} = productionreportApi;
