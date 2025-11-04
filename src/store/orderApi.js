import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://46.62.232.61:8092/api" }),
  tagTypes: ["Orders", "OrderItems", "Tables", "Menu", "Categories"],
  endpoints: (builder) => ({
    // -------------------- Categories --------------------
    getCategories: builder.query({
      query: ({ onlyActive = true, pageNumber = 1, pageSize = 10 }) =>
        `/Category/get-all-categories?onlyActive=${onlyActive}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Categories"],
    }),

    // -------------------- Menu --------------------
    getMenuItems: builder.query({
      query: ({ onlyActive = true, pageNumber = 1, pageSize = 10 }) =>
        `/MenuItem/get-all-menu-items?onlyActive=${onlyActive}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Menu"],
    }),

    getMenuItemsByCategory: builder.query({
      query: ({ categoryId, pageNumber = 1, pageSize = 10 }) =>
        `/MenuItem/get-menu-items-by-category?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Menu"],
    }),

    // -------------------- Orders --------------------
    getAllOrders: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 }) =>
        `/Order/get-all-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Orders"],
    }),

    getSingleOrder: builder.query({
      query: ({ orderId, tableId, waiterId }) =>
        `/Order/get-single-order?OrderId=${orderId}&TableId=${tableId}&WaiterId=${waiterId}`,
      providesTags: (arg) => [{ type: "OrderItems", id: arg.orderId }],
    }),

    getOrderId: builder.query({
      query: ({ tableId }) => `/Order/get-single-order?&TableId=${tableId}`,
      providesTags: (arg) => [{ type: "OrderItems", id: arg.orderId }],
    }),

    getOrderTotal: builder.query({
      query: ({ orderId }) => `/Order/get-order-total?orderId=${orderId}`,
      providesTags: (arg) => [{ type: "OrderItems", id: arg.orderId }],
    }),

    createOrder: builder.mutation({
      query: (newTable) => ({
        url: "/Order/create-order",
        method: "POST",
        body: newTable,
      }),
      invalidatesTags: ["Orders"],
    }),

    addOrderItem: builder.mutation({
      query: ({ orderId, menuItemId }) => ({
        url: `/Order/add-order-item?orderId=${orderId}&menuItemId=${menuItemId}`,
        method: "POST",
      }),
      invalidatesTags: (arg) => [{ type: "OrderItems", id: arg.orderId }],
    }),

    serveOrderItem: builder.mutation({
      query: ({ orderItemId }) => ({
        url: `/Order/serve-order-item?orderItemId=${orderItemId}`,
        method: "PUT",
      }),
      invalidatesTags: (arg) => [{ type: "OrderItems", id: arg.orderItemId }],
    }),

    removeOrderItem: builder.mutation({
      query: ({ orderId, orderItemId }) => ({
        url: `/Order/remove-order-item?orderId=${orderId}&orderItemId=${orderItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (arg) => [{ type: "OrderItems", id: arg.orderId }],
    }),

    confirmOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: `/Order/confirm-order?orderId=${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: (arg) => [
        { type: "Orders" },
        { type: "OrderItems", id: arg.orderId },
      ],
    }),

    payOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: `/Order/pay-for-order?orderId=${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: (arg) => [
        { type: "Orders" },
        { type: "OrderItems", id: arg.orderId },
      ],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/Order/cancel-order?orderId=${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),

    // -------------------- Tables --------------------
    getAllTables: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 }) =>
        `/Table/get-all-tables?OnlyActive=false&OnlyFree=false&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Tables"],
    }),

    // -------------------- Kitchen --------------------
    getKitchenQueue: builder.query({
      query: () => `/Kitchen/get-queue`,
      providesTags: ["Kitchen"],
    }),

    markAsReady: builder.mutation({
      query: ({ orderItemId }) => ({
        url: `/Kitchen/mark-as-ready?orderItemId=${orderItemId}`,
        method: "POST",
      }),
      invalidatesTags: ["Kitchen"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetMenuItemsQuery,
  useGetMenuItemsByCategoryQuery,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useLazyGetOrderTotalQuery,
  useCreateOrderMutation,
  useAddOrderItemMutation,
  useRemoveOrderItemMutation,
  useConfirmOrderMutation,
  usePayOrderMutation,
  useCancelOrderMutation,
  useGetAllTablesQuery,
  useLazyGetOrderIdQuery,
  useServeOrderItemMutation,
  useGetKitchenQueueQuery,
  useMarkAsReadyMutation,
} = orderApi;
