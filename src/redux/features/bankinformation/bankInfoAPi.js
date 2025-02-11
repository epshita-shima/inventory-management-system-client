import { api } from "../../api/apiSlice";

const bankInfoApi= api.injectEndpoints({
  endpoints: (builder) => ({
    getAllBankInformation: builder.query({
        query: () => "/api/v1/bankinfo",
        providesTags: ["insertbankinfo"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      
    insertBankInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/bankinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertbankinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {useGetAllBankInformationQuery,useInsertBankInformationMutation}= bankInfoApi;