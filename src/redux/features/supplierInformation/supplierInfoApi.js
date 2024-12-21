import { api } from "../../api/apiSlice";

const supplierInfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSupplierInformation: builder.query({
      query: () => "/api/v1/supplierinfo",
      providesTags: ["insertsupplierinfo", "updateisupplierinfo","deletesupplierinfo","changessuppliertatus"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertSupplierInformation: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/supplierinfo",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertsupplierinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleSupplierInfo: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/supplierinfo/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),

    updateSupplierDetailsInfo: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/supplierinfo/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updateisupplierinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
    
    updateSupplierInfoStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/supplierinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changessuppliertatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteSupplierInfo: builder.mutation({
      query: (id) => ({
        url: `/api/v1/supplierinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletesupplierinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      })
    }),
  }),
});

export const {
useGetAllSupplierInformationQuery,
useGetSingleSupplierInfoQuery,
useInsertSupplierInformationMutation,
useUpdateSupplierDetailsInfoMutation,useUpdateSupplierInfoStatusMutation,
useDeleteSupplierInfoMutation
} = supplierInfoApi;
