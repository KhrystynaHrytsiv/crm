import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IUser} from "../../../../backend/src/interfaces/IUser";
import {generalService} from "../../services/generalService";

interface AuthState{
    me:IUser | null
}
let initialState: AuthState ={
    me: null

};
const getMe = createAsyncThunk<IUser>(
    "authSlice/me",
    async(_, {rejectWithValue}) =>{
        try{
            return  await generalService.get<IUser>("/auth/me");
        }catch (e) {
            return rejectWithValue(e);
        }

});
export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers:{},
    extraReducers: builder =>
        builder
            .addCase(getMe.fulfilled, (state, action) =>{
                state.me = action.payload
            })
});
export const authActions = {...authSlice.actions, getMe}
