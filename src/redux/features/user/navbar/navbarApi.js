import { api } from "../../../api/apiSlice";

const navbarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNavbar: builder.query({
      query: () => '/api/v1/menuitems',
    }),
  }),
});
export const {useGetNavbarQuery} = navbarApi;
