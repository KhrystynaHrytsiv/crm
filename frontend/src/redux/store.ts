import {configureStore} from "@reduxjs/toolkit";
import {authSlice} from "./slices/authSlice";
import {orderSLice} from "./slices/ordersSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        orders: orderSLice.reducer
    }
});
export type RootState = ReturnType<typeof  store.getState>