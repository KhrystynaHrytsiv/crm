import {
    createAsyncThunk,
    createSlice,
    isPending,
    isRejected,
} from "@reduxjs/toolkit";

import { IManagerWithStatistics } from "../../../../shared/interfaces/IManagerWithStatistics";
import { IResPagination } from "../../../../shared/interfaces/IResPagination";
import { IUser } from "../../../../shared/interfaces/IUser";
import { generalService } from "../../services/generalService";

interface AuthState {
    me: IUser | null;
    managers: IManagerWithStatistics[];
    managersTotalPages: number;
    loading: boolean;
}
const initialState: AuthState = {
    me: null,
    managers: [],
    managersTotalPages: 0,
    loading: false,
};
const getMe = createAsyncThunk<IUser>(
    "managerSlice/me",
    async (_, { rejectWithValue }) => {
        try {
            return await generalService.get<IUser>("/auth/me");
        } catch (e) {
            return rejectWithValue(e);
        }
    },
);
const getManagers = createAsyncThunk<
    IResPagination<IManagerWithStatistics>,
    number
>("managerSlice/getManagers", async (page, { rejectWithValue }) => {
    try {
        return await generalService.get(`/manager?page=${page}`);
    } catch (e) {
        return rejectWithValue(e);
    }
});
export const managerSlice = createSlice({
    name: "managerSlice",
    initialState,
    reducers: {
        updateManagerStatus: (state, action) => {
            const { id, isActive } = action.payload;
            state.managers = state.managers.map((item) =>
                item.manager._id === id
                    ? {
                          ...item,
                          manager: { ...item.manager, is_Active: isActive },
                      }
                    : item,
            );
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getMe.fulfilled, (state, action) => {
                state.me = action.payload;
                state.loading = false;
            })
            .addCase(getManagers.fulfilled, (state, action) => {
                state.managers = action.payload.data;
                state.managersTotalPages = action.payload.totalPages;
                state.loading = false;
            })
            .addMatcher(isPending(getManagers, getMe), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(getManagers, getMe), (state) => {
                state.loading = false;
            }),
});
export const managerAction = { ...managerSlice.actions, getMe, getManagers };
