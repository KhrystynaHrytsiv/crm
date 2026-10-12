import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IUser} from "../../../../backend/src/interfaces/IUser";
import {generalService} from "../../services/generalService";

interface AuthState{
    me:IUser | null,
    managers:IUser[],
}
let initialState: AuthState ={
    me: null,
    managers: []

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
const getManagers = createAsyncThunk<IUser[]>(
    "managerSlice/getManagers",
    async (_, {rejectWithValue}) =>{
        try {
           return await generalService.get('/manager')
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
            state.managers = state.managers.map(manager => manager._id === id ? { ...manager, is_Active: isActive } : manager);
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getMe.fulfilled, (state, action) =>{
                state.me = action.payload
            })
            .addCase(getManagers.fulfilled, (state, action) =>{
                state.managers = action.payload
            })
});
export const managerAction = {...managerSlice.actions, getMe, getManagers}
