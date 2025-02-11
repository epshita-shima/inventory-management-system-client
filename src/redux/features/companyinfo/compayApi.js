import { api } from "../../api/apiSlice";

const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
      getCompanyInfo: builder.query({
        query: () => "/api/v1/company",
      }),
    }),
  });
 
  export const {useGetCompanyInfoQuery}=companyApi