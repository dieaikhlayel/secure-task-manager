import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((s) => s.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ username, password }));
        if (login.fulfilled.match(result)) {
            navigate('/tasks', { replace: true });
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 420, margin: '80px auto' }}>
                <h2>Sign in</h2>
                <form onSubmit={onSubmit}>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
                <p style={{ marginTop: 16 }}>
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}