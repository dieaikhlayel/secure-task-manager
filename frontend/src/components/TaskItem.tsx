import { useAppDispatch } from '../app/hooks';
import { deleteTask, updateTask } from '../features/tasks/taskSlice';
import { Task } from '../features/tasks/taskTypes';

interface Props {
    task: Task;
}

export default function TaskItem({ task }: Props) {
    const dispatch = useAppDispatch();

    const toggle = () => {
        dispatch(updateTask({
            id: task.id,
            data: { description: task.description, completed: !task.completed },
        }));
    };

    const remove = () => {
        dispatch(deleteTask(task.id));
    };

    return (
        <div className="task">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={toggle}
                style={{ width: 'auto', margin: 0 }}
            />
            <span className={task.completed ? 'done' : ''} style={{ flex: 1 }}>
                {task.description}
            </span>
            <button className="danger" onClick={remove}>Delete</button>
        </div>
    );
}