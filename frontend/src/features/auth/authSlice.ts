import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { AuthResponse, AuthState, LoginPayload } from './authTypes';

const STORAGE_KEY = 'stm.auth';

const stored = ((): { token: string; username: string } | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
})();

const initialState: AuthState = {
    token: stored?.token ?? null,
    username: stored?.username ?? null,
    isAuthenticated: !!stored?.token,
    loading: false,
    error: null,
};

export const register = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
    'auth/register',
    async (payload, { rejectWithValue }) => {
        try {
            return await authApi.register(payload);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? 'Registration failed');
        }
    }
);

export const login = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
    'auth/login',
    async (payload, { rejectWithValue }) => {
        try {
            return await authApi.login(payload);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? 'Invalid credentials');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.username = null;
            state.isAuthenticated = false;
            localStorage.removeItem(STORAGE_KEY);
        },
    },
    extraReducers: (builder) => {
        const setLoading = (state: AuthState) => {
            state.loading = true;
            state.error = null;
        };
        const handleSuccess = (state: AuthState, action: { payload: AuthResponse }) => {
            state.loading = false;
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.isAuthenticated = true;
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ token: action.payload.token, username: action.payload.username })
            );
        };
        const handleError = (state: AuthState, action: { payload?: string }) => {
            state.loading = false;
            state.error = action.payload ?? 'Something went wrong';
        };

        builder
            .addCase(register.pending, setLoading)
            .addCase(register.fulfilled, handleSuccess)
            .addCase(register.rejected, handleError)
            .addCase(login.pending, setLoading)
            .addCase(login.fulfilled, handleSuccess)
            .addCase(login.rejected, handleError);
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;