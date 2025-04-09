import { api } from "../../api/apiSlice";

const rawconsumptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    insertRawMaterialConsumption: builder.mutation({
      query: (payload) => ({
        url: "/api/v1/raw-consumption",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["insertRawMaterialConsumption"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const { useInsertRawMaterialConsumptionMutation } = rawconsumptionApi;
