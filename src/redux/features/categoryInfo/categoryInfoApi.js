import { api } from "../../api/apiSlice";

const categoryInfoApi= api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategoryInfo: builder.query({
        query: () => "/categoryinfo",
        providesTags: ["insertcategory"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      
    insertCategoryInfo: builder.mutation({
      query: (payload) => ({
        url: "/categoryinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertcategory"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const { useGetAllCategoryInfoQuery,useInsertCategoryInfoMutation } = categoryInfoApi;