export interface Task {
    id: number;
    description: string;
    completed: boolean;
}

export interface TaskPayload {
    description: string;
    completed: boolean;
}

export interface TaskState {
    items: Task[];
    loading: boolean;
    error: string | null;
}