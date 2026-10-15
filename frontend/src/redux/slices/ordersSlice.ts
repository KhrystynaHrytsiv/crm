import {createAsyncThunk, createSlice, isPending} from "@reduxjs/toolkit";
import {IOrder} from "../../../../backend/src/interfaces/IOrder";
import {generalService} from "../../services/generalService";
import {IResPagination} from "../../../../backend/src/interfaces/IResPagination";
import {CommentResponse} from "../../interfaces/CommentResponse";


interface IState{
    orders:IOrder[],
    groups: string[],
    comments:CommentResponse[],
    statistics:Record<string, number>,
    loading:boolean
}
const initialState: IState ={
    orders:[],
    groups: [],
    comments:[],
    statistics: {},
    loading:false,
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
const getComments = createAsyncThunk<CommentResponse[], string>(
    "orderSlice/getComments",
    async (orderId, {rejectWithValue})=>{
        try {
            return await generalService.get<CommentResponse[]>(`/orders/${orderId}/comments`);
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
                state.loading = false;
            })
            .addCase(getGroups.fulfilled, (state, action) =>{
                state.groups = action.payload;
                state.loading = false;
            })
            .addCase(getComments.fulfilled, (state, action)=>{
                state.comments = action.payload;
                state.loading = false;
            })
            .addCase(getStatistics.fulfilled, (state, action) =>{
                state.statistics = action.payload;
                state.loading = false;
            })
            .addMatcher(isPending(getOrders, getGroups, getComments), state => {
                state.loading = true;
            })
});
export const orderActions = {...orderSLice.actions, getOrders, getGroups, getComments, getStatistics}