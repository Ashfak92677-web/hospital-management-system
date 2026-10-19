import React, { useState } from 'react';
import API from '../api';
import { Activity, Lock, Mail } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@medicare.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '50%' }}>
              <Activity size={36} color="#0284c7" />
            </div>
          </div>
          <h1>MediCare HMS</h1>
          <p>Hospital Administration & Reception Portal</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medicare.com"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Default Credentials:</strong><br />
          Admin: <code>admin@medicare.com / admin123</code><br />
          Staff: <code>staff@medicare.com / staff123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;