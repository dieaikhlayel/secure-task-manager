import { axiosClient } from './axiosClient';
import { AuthResponse, LoginPayload } from '../features/auth/authTypes';

export const authApi = {
    register: (payload: LoginPayload) =>
        axiosClient.post<AuthResponse>('/api/auth/register', payload).then((r) => r.data),
    login: (payload: LoginPayload) =>
        axiosClient.post<AuthResponse>('/api/auth/authenticate', payload).then((r) => r.data),
};