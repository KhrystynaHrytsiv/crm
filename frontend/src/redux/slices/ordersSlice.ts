import {
    createAsyncThunk,
    createSlice, isFulfilled,
    isPending,
    isRejected,
    PayloadAction,
} from "@reduxjs/toolkit";

import { GroupDTO, IGroup } from "../../../../shared/interfaces/IGroup";
import { IOrder } from "../../../../shared/interfaces/IOrder";
import { IResPagination } from "../../../../shared/interfaces/IResPagination";
import { IStatistics } from "../../../../shared/interfaces/IStatistics";
import { generalService } from "../../services/generalService";

interface IState {
    orders: IOrder[];
    groups: IGroup[];
    group: IGroup | null;
    statistics: Partial<IStatistics>;
    loadingCount: number;
    error: string | null;
    currentOrdersRequestId: string | null;
    totalPages: number;
    prevPage: boolean;
    nextPage: boolean;
}
const initialState: IState = {
    orders: [],
    groups: [],
    group: null,
    statistics: {},
    loadingCount: 0,
    error: null,
    currentOrdersRequestId:  null,
    totalPages: 0,
    prevPage: false,
    nextPage: false,
};

const getOrders = createAsyncThunk<IResPagination<IOrder>, { query: string }>(
    "orderSlice/getOrders",
    async ({ query }, { rejectWithValue }) => {
        try {
            return await generalService.get<IResPagination<IOrder>>(
                `/orders?${query}`,
            );
        } catch (e) {
            return rejectWithValue(e);
        }
    },
);
const getGroups = createAsyncThunk<IGroup[]>(
    "orderSlice/getGroups",
    async (_, { rejectWithValue }) => {
        try {
            return await generalService.get("/orders/groups");
        } catch (e) {
            return rejectWithValue(e);
        }
    },
);
const getStatistics = createAsyncThunk<IStatistics>(
    "orderSlice/getStatistics",
    async (_, { rejectWithValue }) => {
        try {
            return await generalService.get("/orders/statistics");
        } catch (e) {
            return rejectWithValue(e);
        }
    },
);
const createGroup = createAsyncThunk<IGroup, GroupDTO>(
    "orderSlice/createGroup",
    async (dto: GroupDTO, { rejectWithValue }) => {
        try {
            return await generalService.post<IGroup, GroupDTO>(
                "/orders/groups",
                dto,
            );
        } catch (e) {
            return rejectWithValue(e);
        }
    },
);
export const orderSLice = createSlice({
    name: "orderSlice",
    initialState,
    reducers: {
        updateOrder: (state, action: PayloadAction<IOrder>) => {
            const index = state.orders.findIndex(
                (order) => order._id === action.payload._id,
            );

            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) =>
    builder
        .addCase(getOrders.pending, (state, action) => {
            state.currentOrdersRequestId = action.meta.requestId;
            state.error = null;
        })
        .addCase(getOrders.fulfilled, (state, action) => {
            if (state.currentOrdersRequestId !== action.meta.requestId) {
                return;
            }

            state.orders = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.prevPage = action.payload.prevPage;
            state.nextPage = action.payload.nextPage;
            state.currentOrdersRequestId = null;
        })
        .addCase(getOrders.rejected, (state, action) => {
            if (state.currentOrdersRequestId !== action.meta.requestId) {
                return;
            }

            state.error =
                (action.payload as string) ||
                action.error.message ||
                "Something went wrong";

            state.currentOrdersRequestId = null;
        })

        .addCase(getGroups.fulfilled, (state, action) => {
            state.groups = action.payload;
        })
        .addCase(getStatistics.fulfilled, (state, action) => {
            state.statistics = action.payload;
        })
        .addCase(createGroup.fulfilled, (state, action) => {
            state.group = action.payload;
            state.groups.push(action.payload);
        })

        .addMatcher(
            isPending(getOrders, getGroups, getStatistics, createGroup),
            (state) => {
                state.loadingCount++;
            },
        )
        .addMatcher(
            isFulfilled(getOrders, getGroups, getStatistics, createGroup),
            (state) => {
                state.loadingCount--;
            },
        )
        .addMatcher(
            isRejected(getOrders, getGroups, getStatistics, createGroup),
            (state) => {
                state.loadingCount--;
            },
        )
});
export const orderActions = {
    ...orderSLice.actions,
    getOrders,
    getGroups,
    getStatistics,
    createGroup,
};
