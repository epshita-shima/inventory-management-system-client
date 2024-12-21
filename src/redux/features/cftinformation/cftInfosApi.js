import { api } from "../../api/apiSlice";

const cftInfosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCFTInfos: builder.query({
      query: () => "/api/v1/cftinfo",
      providesTags: [
        "insertcftinfos",
        "updatecftinfo",
        "changescftinfotatus",
        "deletecftinfo",
      ],
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }),

    insertCFTInfo: builder.mutation({
      query: (payload) => {
        console.log(payload);
        const formData = new FormData();
        formData.append(`openingDate`, payload[0].openingDate);
        formData.append(`isActive`, payload[0].isActive);
        formData.append(`closingDate`, payload[0].closingDate);
        formData.append("makeBy", payload[0].makeBy);
        formData.append("makeDate", payload[0].makeDate);
        formData.append("updateBy", payload[0].updateBy);
        formData.append("updateDate", payload[0].updateDate);

        payload[0].detailsData.forEach((detail, index) => {
          formData.append(`detailsData[${index}][itemId]`, detail.itemId);
          formData.append(`detailsData[${index}][cftPerKg]`, detail.cftPerKg);
          formData.append(`detailsData[${index}][image]`, "");
          if (detail.image) {
            formData.append(`detailsData[${index}][image]`, detail.image);
          }
        });

        return {
          url: "/api/v1/cftinfo",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["insertcftinfos"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    getSingleCFTInfo: builder.query({
      query: (id) => {
        if (id) {
          return `/api/v1/cftinfo/${id}`;
        } else {
          throw new Error("CFT info id is required");
        }
      },
    }),

    updateCFTInfo: builder.mutation({
      query: (payload) => {
        const data=payload;
        console.log(data.id,data.payload.openingDate)
        const formData = new FormData();
        formData.append(`openingDate`, data.payload.openingDate);
        formData.append(`isActive`, data.payload.isActive);
        formData.append(`closingDate`, data.payload.closingDate);
        formData.append("makeBy", data.payload.makeBy);
        formData.append("makeDate", data.payload.makeDate);
        formData.append("updateBy", data.payload.updateBy);
        formData.append("updateDate", data.payload.updateDate);

        data.payload.detailsData.forEach((detail, index) => {
          const file = detail.file;
        
          // Append other data
          formData.append(`detailsData[${index}][itemId]`, detail.itemId);
          formData.append(`detailsData[${index}][cftPerKg]`, detail.cftPerKg);
       
          // Check if detail.file is present
          if (detail.file) {
            // Check if the file is a File object
            if (file instanceof File) {
              formData.append(`detailsData[${index}][image]`, file);
              console.log(`Appending File: detailsData[${index}][image]`, file);
            } else {
              console.error(`Expected a File object but got:`, file);
            }
          } else {
            // Append existing image URL or other image data
            formData.append(`detailsData[${index}][image]`, detail.image);
            console.log(`Appending image URL: detailsData[${index}][image]`, detail.image);
          }
        });
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        return {
          url: `/api/v1/cftinfo/${data.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["updatecftinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    updateCFTInfoStatus: builder.mutation({
      query: (dataToUpdate) => ({
        url: "/api/v1/cftinfo",
        method: "PUT",
        body: dataToUpdate,
      }),
      invalidatesTags: ["changescftinfotatus"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),

    deleteCFTInfo: builder.mutation({
      query: (id) => ({
        url: `/api/v1/cftinfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletecftinfo"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status,
      }),
    }),
  }),
});

export const {
  useGetAllCFTInfosQuery,
  useInsertCFTInfoMutation,
  useGetSingleCFTInfoQuery,
  useUpdateCFTInfoMutation,
  useUpdateCFTInfoStatusMutation,
  useDeleteCFTInfoMutation,
} = cftInfosApi;
