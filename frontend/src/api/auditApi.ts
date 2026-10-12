import { axiosClient } from './axiosClient';
import { AuditLog } from '../features/audit/auditTypes';

export const auditApi = {
    getAll: () => axiosClient.get<AuditLog[]>('/api/logs').then((r) => r.data),
};