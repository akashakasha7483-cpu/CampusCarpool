import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Sparkles, UserCheck, ShieldCheck } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo autofill helper for demonstration
  const handleAutofill = (type) => {
    if (type === 'driver') {
      setEmail('driver@college.edu');
      setPassword('password123');
    } else {
      setEmail('passenger@college.edu');
      setPassword('password123');
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '2.5rem auto 4rem', padding: '0 1rem' }}>
      <div
        className="card"
        style={{
          padding: '2.5rem 2.25rem',
          background: 'linear-gradient(180deg, #111C2E 0%, #0D1626 100%)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
            }}
          >
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Student Login
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Sign in to access your verified CampusCarpool account
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
              <Mail size={14} color="#10b981" /> College Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
              <Lock size={14} color="#10b981" /> Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.75rem', fontSize: '0.96rem', fontWeight: 800 }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to CampusCarpool'}
          </button>
        </form>

        {/* Demo Fast Logins for examiner / reviewer */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            ONE-CLICK DEMO ACCOUNTS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => handleAutofill('driver')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <UserCheck size={13} color="#10b981" />
              Demo Driver
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('passenger')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <UserCheck size={13} color="#38bdf8" />
              Demo Passenger
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.86rem', color: '#94a3b8' }}>
          New student?{' '}
          <Link to="/register" style={{ color: '#34d399', fontWeight: 700 }}>
            Register Student Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
