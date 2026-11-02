import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Sparkles, UserCheck } from '../components/Icons';
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

  // Demo autofill helper for academic demonstration
  const handleAutofill = (type) => {
    if (type === 'driver') {
      setEmail('akash@college.edu');
      setPassword('password123');
    } else {
      setEmail('priya@college.edu');
      setPassword('password123');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2.25rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)',
            }}
          >
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            Student Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Access CampusCarpool with your verified student account
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
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
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to CampusCarpool'}
          </button>
        </form>

        {/* Demo Fast Logins for examiner / reviewer */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0' }}>
          <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textAlign: 'center', marginBottom: '0.6rem' }}>
            QUICK DEMO ACCOUNTS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleAutofill('driver')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <UserCheck size={13} color="#10b981" />
              Fill Driver (Akash)
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('passenger')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <UserCheck size={13} color="#1e3a8a" />
              Fill Passenger (Priya)
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          New student?{' '}
          <Link to="/register" style={{ color: '#10b981', fontWeight: 700 }}>
            Register Student Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
