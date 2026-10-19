import {createAsyncThunk, createSlice, isPending} from "@reduxjs/toolkit";
import {IUser} from "../../../../shared/interfaces/IUser";
import {generalService} from "../../services/generalService";
import {IManagerWithStatistics} from "../../../../shared/interfaces/IManagerWithStatistics";

interface AuthState{
    me:IUser | null,
    managers:IManagerWithStatistics[],
    loading:boolean
}
let initialState: AuthState ={
    me: null,
    managers: [],
    loading:false

};
const getMe = createAsyncThunk<IUser>(
    "managerSlice/me",
    async(_, {rejectWithValue}) =>{
        try{
            return  await generalService.get<IUser>("/auth/me");
        }catch (e) {
            return rejectWithValue(e);
        }

});
const getManagers = createAsyncThunk<IManagerWithStatistics[]>(
    "managerSlice/getManagers",
    async (_, {rejectWithValue}) =>{
        try {
            return await generalService.get('/manager');
        }catch (e) {
            return rejectWithValue(e);
        }
    }
)
export const managerSlice = createSlice({
    name: "managerSlice",
    initialState,
    reducers:{
        updateManagerStatus: (state, action) => {
            const { id, isActive } = action.payload;
            state.managers = state.managers.map((item) => item.manager._id === id ? { ...item, manager: {...item.manager, is_Active: isActive},
                } : item);
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getMe.fulfilled, (state, action) =>{
                state.me = action.payload;
                state.loading = false;

            })
            .addCase(getManagers.fulfilled, (state, action) =>{
                state.managers = action.payload;
                state.loading = false;
            })
            .addMatcher(isPending(getManagers, getMe), state => {
                state.loading = true;
            })
});
export const managerAction = {...managerSlice.actions, getMe, getManagers}
