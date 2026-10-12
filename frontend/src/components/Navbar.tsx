import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const username = useAppSelector((s) => s.auth.username);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    return (
        <nav className="navbar">
            <div>
                <Link to="/tasks">Tasks</Link>
                <Link to="/logs">Audit Log</Link>
            </div>
            <div>
                {username && <span style={{ marginRight: 12 }}>Hi, {username}</span>}
                <button className="ghost" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}