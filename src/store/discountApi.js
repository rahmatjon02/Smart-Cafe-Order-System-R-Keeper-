import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://46.62.232.61:8092/api";

export const discountApi = createApi({
  reducerPath: "discountApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Discounts"],
  endpoints: (builder) => ({
    // GET — все скидки
    getDiscounts: builder.query({
      query: () => "/Discount/get-all-discounts?pageNumber=1&pageSize=100",
      providesTags: ["Discounts"],
    }),

    // POST — создать скидку
    createDiscount: builder.mutation({
      query: (discount) => ({
        url: "/Discount/create-discount",
        method: "POST",
        body: { dto: discount }, // ✅ добавили dto
      }),
      invalidatesTags: ["Discounts"],
    }),

    // DELETE — завершить скидку
    endDiscount: builder.mutation({
      query: (id) => ({
        url: `/Discount/end-discount?discountId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Discounts"],
    }),
  }),
});

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useEndDiscountMutation,
} = discountApi;
