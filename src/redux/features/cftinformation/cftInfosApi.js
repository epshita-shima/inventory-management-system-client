import { api } from "../../api/apiSlice";

const cftInfosApi= api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCFTInfos: builder.query({
        query: () => "/cftinfo",
        providesTags: ["insertcftinfos","updatecftinfo","changescftinfotatus","deletecftinfo"],
        refetchOnReconnect: true,
        refetchOnFocus: true,
      }),
      
      insertCFTInfo: builder.mutation({
        query: (payload) => {
          const formData = new FormData();
  
          formData.append("makeBy", payload[0].makeBy);
          formData.append("makeDate", payload[0].makeDate);
          formData.append("updateBy", payload[0].updateBy);
          formData.append("updateDate", payload[0].updateDate);
          
          payload[0].detailsData.forEach((detail, index) => {
            formData.append(`detailsData[${index}][openingDate]`, detail.openingDate);
            formData.append(`detailsData[${index}][itemId]`, detail.itemId);
            formData.append(`detailsData[${index}][cftPerKg]`, detail.cftPerKg);
            formData.append(`detailsData[${index}][image]`, detail.image);
            formData.append(`detailsData[${index}][isActive]`, detail.isActive);
            formData.append(`detailsData[${index}][closingDate]`, detail.closingDate);
            
            // if (detail.image) {
            //   formData.append(`detailsData[${index}][image]`, detail.image);
            //   console.log('Backend',detail.image,detail);
            // }
          });
          formData.getAll('image')
          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }
         
          // formData.append("detailsData", JSON.stringify(payload[0].detailsData));
          // payload[0].detailsData.forEach((detail, index) => {
          //   if (detail.image) {
          //     formData.append(`detailsData[${index}][image]`, detail.image);
          //   }
          // });
          return {
            url: "/cftinfo",
            method: "POST",
            body: formData,
            // headers: { "Content-Type": "multipart/form-data" },
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
            return `/cftinfo/${id}`;
          } else {
            throw new Error("CFT info id is required");
          }
        },
      }),

      updateCFTInfo: builder.mutation({
        query: (payload) => (
          {
          url: `/cftinfo/${payload.id}`,
          method: "PUT",
          body: payload.data,
        }
      ),
        invalidatesTags: ["updatecftinfo"],
        transformResponse: (response, meta) => ({
          data: response,
          status: meta.response.status,
        }),
      }),

      updateCFTInfoStatus: builder.mutation({
        query: (dataToUpdate) => ({
          url: "/cftinfo",
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
          url: `/cftinfo/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["deletecftinfo"],
        transformResponse: (response, meta) => ({
          data: response,
          status: meta.response.status
        })
      
      }),
  }),
  
});

export const{useGetAllCFTInfosQuery,useInsertCFTInfoMutation,useGetSingleCFTInfoQuery,useUpdateCFTInfoMutation,useUpdateCFTInfoStatusMutation,useDeleteCFTInfoMutation}=cftInfosApi