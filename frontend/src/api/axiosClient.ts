import axios from 'axios';

const STORAGE_KEY = 'stm.auth';

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// --- Request interceptor: attach JWT ---
axiosClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const { token } = JSON.parse(raw);
            if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch {
            // corrupted storage — clear and continue unauthenticated
            localStorage.removeItem(STORAGE_KEY);
        }
    }
    return config;
});

// --- Response interceptor: handle 401 ---
axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEY);
            // hard reload to reset Redux + force login
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);