import { api } from "../../api/apiSlice";

const combinereportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getManagementCombineReport: builder.query({
      query: (queryParams) => ({
        url: "/combine-report",
        params: queryParams,
        providesTags: [],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
    }),
  })
})
export const{useLazyGetManagementCombineReportQuery}=combinereportApi