export interface AuthResponse {
    token: string;
    username: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthState {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}