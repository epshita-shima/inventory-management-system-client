import { api } from "../../api/apiSlice";

const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
      getCompanyInfo: builder.query({
        query: () => "/company",
      }),
    }),
  });
 
  export const {useGetCompanyInfoQuery}=companyApi