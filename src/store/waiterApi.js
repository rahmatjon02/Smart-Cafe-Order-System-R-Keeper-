import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://46.62.232.61:8092/api";

export const waiterApi = createApi({
  reducerPath: "waiterApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["WaiterStats"],
  endpoints: (builder) => ({
    // Профиль официанта
    getProfile: builder.query({
      query: () => `/Auth/profile`,
      providesTags: ["WaiterStats"],
    }),
    getOrdersCount: builder.query({
      query: () => `/WaiterService/get-number-of-orders`,
      providesTags: ["WaiterStats"],
    }),
    // Общая сумма заказов официанта
    getOrdersTotal: builder.query({
      query: () => `/WaiterService/get-orders-total`,
      providesTags: ["WaiterStats"],
    }),
    // Среднее время заказа
    getAvgOrderTime: builder.query({
      query: () => `/WaiterService/get-avg-order-time`,
      providesTags: ["WaiterStats"],
    }),
    getAllWaiters: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 }) =>
        `/Auth/get-all-waiters?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["WaiterStats"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetOrdersCountQuery,
  useGetOrdersTotalQuery,
  useGetAvgOrderTimeQuery,
  useGetAllWaitersQuery,
} = waiterApi;
