import { axiosClient } from './axiosClient';
import { Task, TaskPayload } from '../features/tasks/taskTypes';

export const taskApi = {
    getAll: () => axiosClient.get<Task[]>('/api/tasks').then((r) => r.data),
    create: (payload: TaskPayload) =>
        axiosClient.post<Task>('/api/tasks', payload).then((r) => r.data),
    update: (id: number, payload: TaskPayload) =>
        axiosClient.put<Task>(`/api/tasks/${id}`, payload).then((r) => r.data),
    remove: (id: number) =>
        axiosClient.delete<void>(`/api/tasks/${id}`).then((r) => r.data),
};