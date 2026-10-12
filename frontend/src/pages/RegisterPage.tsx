import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register } from '../features/auth/authSlice';

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((s) => s.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = await dispatch(register({ username, password }));
        if (register.fulfilled.match(result)) {
            navigate('/tasks', { replace: true });
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 420, margin: '80px auto' }}>
                <h2>Create account</h2>
                <form onSubmit={onSubmit}>
                    <input
                        placeholder="Username (min 3 chars)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Creating…' : 'Register'}
                    </button>
                </form>
                <p style={{ marginTop: 16 }}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}