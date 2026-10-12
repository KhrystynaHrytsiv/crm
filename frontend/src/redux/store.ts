import {configureStore} from "@reduxjs/toolkit";
import {managerSlice} from "./slices/managerSlice";
import {orderSLice} from "./slices/ordersSlice";

export const store = configureStore({
    reducer: {
        manager: managerSlice.reducer,
        orders: orderSLice.reducer
    }
});
export type RootState = ReturnType<typeof  store.getState>