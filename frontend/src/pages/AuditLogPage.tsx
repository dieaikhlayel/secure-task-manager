import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAuditLogs } from '../features/audit/auditSlice';

export default function AuditLogPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((s) => s.audit);

    useEffect(() => {
        dispatch(fetchAuditLogs());
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h2>Audit Log</h2>
                    {loading && <p>Loading…</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && items.length === 0 && <p>No activity yet.</p>}
                    {items.map((log) => (
                        <div key={log.id} className="log-item">
                            <strong>{log.action}</strong>
                            {log.details && <> — {log.details}</>}
                            <br />
                            <small>{new Date(log.timestamp).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}