import { configureStore } from "@reduxjs/toolkit";
import { orderApi } from "./orderApi";
import { authApi } from "./authApi";
import { waiterApi } from "./waiterApi";
import { reportApi } from "./reportApi";
import { discountApi } from "./discountApi";

export const store = configureStore({
  reducer: {
    [orderApi.reducerPath]: orderApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [waiterApi.reducerPath]: waiterApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [discountApi.reducerPath]: discountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      orderApi.middleware,
      authApi.middleware,
      waiterApi.middleware,
      reportApi.middleware,
      discountApi.middleware
    ),
});
