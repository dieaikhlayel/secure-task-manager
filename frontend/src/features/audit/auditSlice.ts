import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auditApi } from '../../api/auditApi';
import { AuditLog, AuditState } from './auditTypes';

const initialState: AuditState = { items: [], loading: false, error: null };

export const fetchAuditLogs = createAsyncThunk<AuditLog[], void, { rejectValue: string }>(
    'audit/fetchAll',
    async (_, { rejectWithValue }) => {
        try { return await auditApi.getAll(); }
        catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed to load logs'); }
    }
);

const auditSlice = createSlice({
    name: 'audit',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchAuditLogs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
            .addCase(fetchAuditLogs.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? 'Error'; });
    },
});

export default auditSlice.reducer;