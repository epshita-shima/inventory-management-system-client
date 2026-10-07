import { api } from "../../api/apiSlice";

const dashboardchartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllHeadingTotalInfo: builder.query({
      query: (queryParams) => ({
        url: "/api/v1/sales-chart/sales-total",
        params: queryParams,
      }),
      providesTags: [],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
  }),
});

export const{useGetAllHeadingTotalInfoQuery}=dashboardchartApi