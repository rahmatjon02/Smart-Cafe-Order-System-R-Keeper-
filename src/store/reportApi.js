import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://46.62.232.61:8092/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery,
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    getNumberOfOrders: builder.query({
      query: () => "/Report/get-number-of-orders",
      providesTags: ["Report"],
    }),
    getTodayTotalRevenue: builder.query({
      query: () => "/Report/get-today-total-revenue",
      providesTags: ["Report"],
    }),
    getAvgCheckTotal: builder.query({
      query: () => "/Report/get-avg-check-total",
      providesTags: ["Report"],
    }),
    getAvgOrderDuration: builder.query({
      query: () => "/Report/get-avg-order-duration",
      providesTags: ["Report"],
    }),
    getPopularMenuItems: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 }) =>
        `/Report/get-popular-menu-items?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetNumberOfOrdersQuery,
  useGetTodayTotalRevenueQuery,
  useGetAvgCheckTotalQuery,
  useGetAvgOrderDurationQuery,
  useGetPopularMenuItemsQuery,
} = reportApi;
