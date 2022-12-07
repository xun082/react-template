import { configureStore } from "@reduxjs/toolkit";

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import test from "./module/test";

const store = configureStore({
  reducer: { test },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
