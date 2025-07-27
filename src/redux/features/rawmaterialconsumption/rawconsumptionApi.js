import { api } from "../../api/apiSlice";

const rawconsumptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRawMaterialConsumptionInformation: builder.query({
      query: () => "/api/v1/raw-consumption",
      providesTags: [
        "insertRawMaterialConsumption",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

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

export const {useGetAllRawMaterialConsumptionInformationQuery ,useInsertRawMaterialConsumptionMutation } = rawconsumptionApi;
