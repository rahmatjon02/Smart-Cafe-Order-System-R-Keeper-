// src/store/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://46.62.232.61:8092/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // POST /api/Auth/register
    register: builder.mutation({
      query: (payload) => ({
        url: "/Auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),

    // POST /api/Auth/login
    login: builder.mutation({
      query: (payload) => ({
        url: "/Auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),

    getRoleFromToken: builder.mutation({
      query: (token) => ({
        url: "/Auth/get-role-from-token",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetRoleFromTokenMutation,
} = authApi;
