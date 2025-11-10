import { configureStore } from "@reduxjs/toolkit";
import { orderApi } from "./orderApi";
import { authApi } from "./authApi";
import { waiterApi } from "./waiterApi";

export const store = configureStore({
  reducer: {
    [orderApi.reducerPath]: orderApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [waiterApi.reducerPath]: waiterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      orderApi.middleware,
      authApi.middleware,
      waiterApi.middleware
    ),
});
