import { FormEvent, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addTask } from '../features/tasks/taskSlice';

export default function TaskForm() {
    const dispatch = useAppDispatch();
    const [description, setDescription] = useState('');

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = description.trim();
        if (!trimmed) return;

        const result = await dispatch(addTask({ description: trimmed, completed: false }));
        if (addTask.fulfilled.match(result)) {
            setDescription('');
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
                placeholder="What needs to be done?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ marginBottom: 0 }}
            />
            <button type="submit">Add</button>
        </form>
    );
}