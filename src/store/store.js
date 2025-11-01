import { configureStore } from "@reduxjs/toolkit";
import { orderApi } from "./orderApi";

export const store = configureStore({
  reducer: {
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderApi.middleware),
});
