import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTasks } from '../features/tasks/taskSlice';

export default function TasksPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((s) => s.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h2>My Tasks</h2>
                    <TaskForm />
                </div>

                <div className="card">
                    {loading && <p>Loading…</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && items.length === 0 && <p>No tasks yet. Add one above.</p>}
                    {items.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </>
    );
}