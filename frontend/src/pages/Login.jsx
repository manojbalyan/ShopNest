import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'customer';
  const [role, setRole] = useState(initialRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setRole('admin');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        // Enforce role check if attempting Admin login
        if (role === 'admin' && data.role !== 'admin') {
          setError('Access Denied: This account does not have Admin privileges.');
          return;
        }

        login(data);

        // Redirect appropriately based on role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '420px', width: '100%' }}>
        
        {/* Role Toggle Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: '25px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #27272a'
        }}>
          <button
            type="button"
            onClick={() => { setRole('customer'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px 10px',
              border: 'none',
              cursor: 'pointer',
              background: role === 'customer' ? '#f97316' : '#18181b',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              transition: 'background 0.2s'
            }}
          >
            👤 Customer Login
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px 10px',
              border: 'none',
              cursor: 'pointer',
              background: role === 'admin' ? '#f97316' : '#18181b',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              transition: 'background 0.2s'
            }}
          >
            🛡️ Admin Portal
          </button>
        </div>

        <h2 style={{ marginBottom: '8px' }}>
          {role === 'admin' ? 'Admin Portal Login' : 'Customer Sign In'}
        </h2>
        
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>
          {role === 'admin'
            ? 'Sign in with administrative credentials to manage store metrics, products, and orders.'
            : 'Welcome back! Sign in to view your orders, cart, and profile.'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid #ef4444',
            padding: '10px 15px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn" style={{ marginTop: '10px', width: '100%', padding: '12px' }}>
          {role === 'admin' ? 'Sign In to Admin Dashboard' : 'Sign In as Customer'}
        </button>

        {role === 'customer' && (
          <p style={{ marginTop: '20px', color: '#a1a1aa', textAlign: 'center' }}>
            Don't have an account? <Link to="/register" style={{ color: '#f97316', fontWeight: 'bold' }}>Register</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;

