export interface AuditLog {
    id: number;
    username: string;
    action: string;
    details: string | null;
    timestamp: string;
}

export interface AuditState {
    items: AuditLog[];
    loading: boolean;
    error: string | null;
}