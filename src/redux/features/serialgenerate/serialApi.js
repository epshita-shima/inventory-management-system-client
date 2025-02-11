import { api } from "../../api/apiSlice";

const supplierInfoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSerialNo:builder.query({
      query:()=>'/api/v1/serial'
    }),
    createSerialNo:builder.mutation({
      query: (payload) => ({
        url: "/api/v1/serial",
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