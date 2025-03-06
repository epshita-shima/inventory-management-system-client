import { api } from "../../api/apiSlice";

const dashboardchartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllHeadingTotalInfo: builder.query({
      query: () => "/api/v1/sales-chart/sales-total",
      providesTags: [ ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),
  }),
});

export const{useGetAllHeadingTotalInfoQuery}=dashboardchartApi