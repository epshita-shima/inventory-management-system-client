import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl:process.env.REACT_APP_BASE_URL,
    prepareHeaders:(headers)=>{
      const token=localStorage.getItem('jwtToken');
      if(token){
        headers.set('Authorization',`Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['createuser','changestatus','changesmanytatus','deleteuser'],
  endpoints: (builder) => ({
    addNewUser: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
    }),
    userLogin: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),
    getUser:builder.query({
      query: () => '/getuser',
    }),
 
    // getUserRole:builder.query({
    //   query:()=>"/get-user-role"
    // })
  }),
});

export const { useAddNewUserMutation, useUserLoginMutation,useGetUserQuery} = api;
