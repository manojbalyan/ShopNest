import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (res.ok) {
        // Clear input fields immediately
        setName('');
        setEmail('');
        setPassword('');

        // Show success pop/reaction
        setSuccess('Account created successfully! Logging you in...');
        login(data);

        // Redirect smoothly after brief visual confirmation
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setError(data.message || 'Registration failed. Please check your details.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to server. Please check your network and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '420px', width: '100%' }}>
        <h2>Create Account</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: '-5px 0 10px 0', textAlign: 'center' }}>
          Join ShopNest to enjoy fast checkouts and track your orders.
        </p>

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            border: '1px solid #10b981',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>🎉</span>
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid #ef4444',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading || Boolean(success)}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading || Boolean(success)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || Boolean(success)}
        />

        <button
          type="submit"
          className="btn"
          disabled={loading || Boolean(success)}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '14px',
            cursor: loading || success ? 'not-allowed' : 'pointer',
            opacity: loading || success ? 0.75 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          {loading ? (
            <>
              <span>⏳</span>
              <span>Creating Account...</span>
            </>
          ) : success ? (
            <>
              <span>✅</span>
              <span>Account Created!</span>
            </>
          ) : (
            'Register'
          )}
        </button>

        <p style={{ marginTop: '15px', color: '#a1a1aa', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#f97316', fontWeight: 'bold' }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
