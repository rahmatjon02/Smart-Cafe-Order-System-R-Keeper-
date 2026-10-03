import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "/api";

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

    updateWaiter: builder.mutation({
      query: ({ id, name, username }) => ({
        url: "/Auth/update-waiter",
        method: "PUT",
        body: { id, name, username },
      }),
      invalidatesTags: ["WaiterStats"],
    }),

    changePassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: "/Auth/change-password",
        method: "PUT",
        body: { id, newPassword },
      }),
    }),

    deactivateWaiter: builder.mutation({
      query: (userId) => ({
        url: `/Auth/deactivate-waiter?userId=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WaiterStats"],
    }),

    activateWaiter: builder.mutation({
      query: (userId) => ({
        url: `/Auth/activate-waiter?userId=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["WaiterStats"],
    }),

    deleteWaiter: builder.mutation({
      query: (userId) => ({
        url: `/Auth/delete-waiter?userId=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WaiterStats"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetOrdersCountQuery,
  useGetOrdersTotalQuery,
  useGetAvgOrderTimeQuery,
  useGetAllWaitersQuery,
  useUpdateWaiterMutation,
  useChangePasswordMutation,
  useDeactivateWaiterMutation,
  useActivateWaiterMutation,
  useDeleteWaiterMutation,
} = waiterApi;
