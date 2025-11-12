import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://46.62.232.61:8092/api";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Orders", "OrderItems", "Tables", "Menu", "Categories"],
  endpoints: (builder) => ({
    // -------------------- Categories --------------------
    getCategories: builder.query({
      query: ({ onlyActive = true, pageNumber = 1, pageSize = 10 }) =>
        `/Category/get-all-categories?onlyActive=${onlyActive}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/Category/create-category",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/Category/update-category",
        method: "PUT",
        body: categoryData,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/Category/delete-category?id=${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    activateCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/Category/activate-category?id=${categoryId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Categories"],
    }),

    addMenuItemToCategory: builder.mutation({
      query: ({ categoryId, menuItemId }) => ({
        url: `/Category/add-menu-item-to-category?categoryId=${categoryId}&menuItemId=${menuItemId}`,
        method: "POST",
      }),
      invalidatesTags: ["Categories", "Menu"],
    }),

    removeMenuItemFromCategory: builder.mutation({
      query: ({ categoryId, menuItemId }) => ({
        url: `/Category/remove-menu-item-from-category?categoryId=${categoryId}&menuItemId=${menuItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories", "Menu"],
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

    createMenuItem: builder.mutation({
      query: (menuItemData) => ({
        url: "/MenuItem/create-menu-item",
        method: "POST",
        body: menuItemData,
      }),
      invalidatesTags: ["Menu"],
    }),

    updateMenuItem: builder.mutation({
      query: (menuItemData) => ({
        url: "/MenuItem/update-menu-item",
        method: "PUT",
        body: menuItemData,
      }),
      invalidatesTags: ["Menu"],
    }),

    deleteMenuItem: builder.mutation({
      query: ({ menuItemId }) => ({
        url: `/MenuItem/delete-menu-item?id=${menuItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menu"],
    }),

    activateMenuItem: builder.mutation({
      query: ({ menuItemId }) => ({
        url: `/MenuItem/activate-menu-item?id=${menuItemId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Menu"],
    }),

    // -------------------- Orders --------------------
    getAllOrders: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 }) =>
        `/Order/get-all-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ["Orders"],
    }),

    getSingleOrder: builder.query({
      query: ({ tableId }) => `/Order/get-single-order?&TableId=${tableId}`,
      providesTags: (arg) => [{ type: "OrderItems", id: arg.orderId }],
    }),

    getSingleOrderById: builder.query({
      query: ({ OrderId }) => `/Order/get-single-order?OrderId=${OrderId}`,
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

    createTable: builder.mutation({
      query: (tableData) => ({
        url: "/Table/create-table",
        method: "POST",
        body: { numberOfSeats: tableData },
      }),
      invalidatesTags: ["Tables"],
    }),

    deactivateTable: builder.mutation({
      query: ({ tableId }) => ({
        url: `/Table/deactivate-table?tableId=${tableId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tables"],
    }),

    activateTable: builder.mutation({
      query: ({ tableId }) => ({
        url: `/Table/activate-table?tableId=${tableId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Tables"],
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

    searchMenuItems: builder.query({
      query: ({ name, pageNumber = 1, pageSize = 100 }) => ({
        url: `MenuItem/search-menu-items?name=${encodeURIComponent(
          name
        )}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
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
  useCreateTableMutation,
  useDeactivateTableMutation,
  useActivateTableMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useActivateCategoryMutation,
  useAddMenuItemToCategoryMutation,
  useRemoveMenuItemFromCategoryMutation,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useActivateMenuItemMutation,
  useSearchMenuItemsQuery,
  useLazyGetSingleOrderByIdQuery,
} = orderApi;
