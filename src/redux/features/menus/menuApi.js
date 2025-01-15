import { api } from "../../api/apiSlice";

const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllMenuItems: builder.query({
      query: () => "/menuitems",
      providesTags: ["getallmenu", "getallchildmenu", "deletemenu","updatenestedmenudata","updatesinglemenudata,updatesingleportionmenu"],
      refetchOnReconnect: true,
      refetchOnFocus: true,
      refetchOnTags: ["getallmenu", "getallchildmenu", "deletemenu","updatenestedmenudata","updatesinglemenudata,updatesingleportionmenu"],
    }),
    createMenu: builder.mutation({
      query: (payload) => ({
        url: "/menuitems/create/menu",
        method: "POST",
        body: payload,
      }),
      // async onQueryStarted(payload, { dispatch, queryFulfilled }) {
      //   try {
      //     dispatch(api.util.invalidateTags(["getallmenu", "getallchildmenu"]));
      //     await dispatch(api.endpoints.getAllMenuItems.initiate());
      //   } catch {}
      // },
      invalidatesTags: ["getallmenu"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      }),
    }),
    updateMenu: builder.mutation({
      query: (payload) => (
        {
        url: "/menuitems/update/menu",
        method: "POST",
        body: payload,
      }),

      invalidatesTags: ["getallchildmenu"],
      transformResponse: (response, meta, arg) => ({
        data: response,
        status: meta.response.status
      }),
    }),
    updateNestedMenu: builder.mutation({
      query: (payload) => ({
        url: "/menuitems/updatenesteditems/menu",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["updatenestedmenudata"],
      transformResponse: (response, meta, arg) => ({
        data: response,
        status: meta.response.status
      }),
    }),
    updateSingleMenu: builder.mutation({
      query: (payload) => ({
        url: "/menuitems/updatesingle-menu",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["updatesinglemenudata"],
      transformResponse: (response, meta, arg) => ({
        data: response,
        status: meta.response.status
      }),
    }),
    updateSingleProtionMenu: builder.mutation({
      query: (payload) => ({
        url: `/menuitems/singlemenu/singleupdate/${payload._id}`,
        method: "PUT",
        body: payload,
      }),
         async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        try {
          dispatch(api.util.invalidateTags(["getallmenu", "getallchildmenu",]));
          await dispatch(api.endpoints.getAllMenuItems.initiate());
        } catch {}
      },
      invalidatesTags: ["updatesingleportionmenu"],
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      }),
    }),
    getSingleMenu: builder.query({
      query: (id) => {
        if (id) {
          return `/menuitems/singlemenu/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    getSingleChangeParentMenu: builder.query({
      query: (id) => {
        if (id) {
          return `/menuitems/singlemenu/changingparent/${id}`;
        } else {
          throw new Error("User id is required");
        }
      },
    }),
    deleteMenuData: builder.mutation({
      query: (id) => ({
        url: `/menuitems/deletemenu/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response, meta) => ({
        data: response,
        status: meta.response.status
      }),
      invalidatesTags: ["deletemenu"],
    }),
  }),
});

export const {
  useGetAllMenuItemsQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useGetSingleMenuQuery,
  useGetSingleChangeParentMenuQuery,
  useUpdateSingleMenuMutation,
  useUpdateNestedMenuMutation,
  useUpdateSingleProtionMenuMutation,
  useDeleteMenuDataMutation,
} = menuApi;
