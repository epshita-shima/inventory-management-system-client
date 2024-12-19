import { api } from "../../api/apiSlice";

const supplierInfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSerialNo:builder.query({
      query:()=>'/serial'
    }),
    createSerialNo:builder.mutation({
      query: (payload) => ({
        url: "/serial",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  })
})

export const {useGetSerialNoQuery ,useCreateSerialNoMutation}=supplierInfoApi;