import {createAsyncThunk, createSlice, isPending, isRejected} from "@reduxjs/toolkit";
import {IOrder} from "../../../../shared/interfaces/IOrder";
import {generalService} from "../../services/generalService";
import {IResPagination} from "../../../../shared/interfaces/IResPagination";


interface IState{
    orders:IOrder[],
    groups: string[],
    statistics:Record<string, number>,
    loading:boolean,
    totalPages: number,
    prevPage: boolean;
    nextPage: boolean;

}
const initialState: IState ={
    orders:[],
    groups: [],
    statistics: {},
    loading:false,
    totalPages: 0,
    prevPage: false,
    nextPage: false
}

const getOrders = createAsyncThunk<IResPagination<IOrder>, {query:string}>(
    "orderSlice/getOrders",
    async ({query}, {rejectWithValue}) =>{
        try {
           return await generalService.get<IResPagination<IOrder>>(`/orders?${query}`);
        }catch (e) {
            return rejectWithValue(e);
        }
    }
);
const getGroups = createAsyncThunk<string[]>(
    "orderSlice/getGroups",
    async (_, {rejectWithValue}) =>{
        try{
            return await generalService.get('/orders/groups');
        }catch (e) {
            return rejectWithValue(e);
        }
    }
);
const getStatistics = createAsyncThunk<Record<string, number>>(
    "orderSlice/getStatistics",
    async (_, {rejectWithValue}) =>{
        try{
            return await generalService.get('/orders/statistics')
        }catch (e) {
            return rejectWithValue(e);
        }
    }
)
export const orderSLice = createSlice({
    name: "orderSlice",
    initialState,
    reducers:{},
    extraReducers: builder =>
        builder
            .addCase(getOrders.fulfilled, (state, action) =>{
                state.orders = action.payload.data;
                state.totalPages = action.payload.totalPages;
                state.prevPage = action.payload.prevPage;
                state.nextPage = action.payload.nextPage;
                state.loading = false;
            })
            .addCase(getGroups.fulfilled, (state, action) =>{
                state.groups = action.payload;
                state.loading = false;
            })
            .addCase(getStatistics.fulfilled, (state, action) =>{
                state.statistics = action.payload;
                state.loading = false;
            })
            .addMatcher(isPending(getOrders, getGroups), state => {
                state.loading = true;
            })
            .addMatcher(isRejected(getOrders, getGroups, getStatistics), state => {
                state.loading = false;
            })
});
export const orderActions = {...orderSLice.actions, getOrders, getGroups, getStatistics}