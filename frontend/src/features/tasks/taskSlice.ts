import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';
import { Task, TaskPayload, TaskState } from './taskTypes';

const initialState: TaskState = { items: [], loading: false, error: null };

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
    'tasks/fetchAll',
    async (_, { rejectWithValue }) => {
        try { return await taskApi.getAll(); }
        catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed to load tasks'); }
    }
);

export const addTask = createAsyncThunk<Task, TaskPayload, { rejectValue: string }>(
    'tasks/add',
    async (payload, { rejectWithValue }) => {
        try { return await taskApi.create(payload); }
        catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed to add task'); }
    }
);

export const updateTask = createAsyncThunk<Task, { id: number; data: TaskPayload }, { rejectValue: string }>(
    'tasks/update',
    async ({ id, data }, { rejectWithValue }) => {
        try { return await taskApi.update(id, data); }
        catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed to update task'); }
    }
);

export const deleteTask = createAsyncThunk<number, number, { rejectValue: string }>(
    'tasks/delete',
    async (id, { rejectWithValue }) => {
        try { await taskApi.remove(id); return id; }
        catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed to delete task'); }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
            .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? 'Error'; })

            .addCase(addTask.fulfilled, (s, a) => { s.items.unshift(a.payload); })
            .addCase(addTask.rejected, (s, a) => { s.error = a.payload ?? 'Error'; })

            .addCase(updateTask.fulfilled, (s, a) => {
                const idx = s.items.findIndex((t) => t.id === a.payload.id);
                if (idx !== -1) s.items[idx] = a.payload;
            })
            .addCase(updateTask.rejected, (s, a) => { s.error = a.payload ?? 'Error'; })

            .addCase(deleteTask.fulfilled, (s, a) => {
                s.items = s.items.filter((t) => t.id !== a.payload);
            })
            .addCase(deleteTask.rejected, (s, a) => { s.error = a.payload ?? 'Error'; });
    },
});

export default taskSlice.reducer;