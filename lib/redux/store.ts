import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import marketReducer from "./slices/marketSlice";
import stockReducer from "./slices/stockSlice";

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    market: marketReducer,
    stock: stockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
