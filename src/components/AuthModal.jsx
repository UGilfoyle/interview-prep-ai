import React, { useState } from 'react';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  DatabaseOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { loginUser, registerUser } from '../services/authService';

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      if (tab === 'register') {
        const res = await registerUser({ email, password, name });
        if (res.notice) setSuccessNotice(res.notice);
        onAuthSuccess(res.user);
        setTimeout(() => onClose(), 1200);
      } else {
        const res = await loginUser({ email, password });
        if (res.notice) setSuccessNotice(res.notice);
        onAuthSuccess(res.user);
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="auth-modal card">
        <div className="modal-header">
          <div className="modal-title-group">
            <DatabaseOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />
            <div>
              <h3 className="modal-title">
                {tab === 'login' ? 'Sign In to InterviewPrep' : 'Create an Account'}
              </h3>
              <p className="modal-subtitle">Sync your practice history with Neon Serverless Postgres</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-bar">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form modal-body">
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">
                Full Name
              </label>
              <div className="input-with-icon">
                <UserOutlined className="input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  className="input-base with-icon"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <MailOutlined className="input-icon" />
              <input
                id="auth-email"
                type="email"
                className="input-base with-icon"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Password <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <LockOutlined className="input-icon" />
              <input
                id="auth-password"
                type="password"
                className="input-base with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="key-status-banner status-error animate-fade-in">
              <AlertOutlined />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="key-status-banner status-success animate-fade-in">
              <CheckCircleOutlined />
              <span>{successNotice}</span>
            </div>
          )}

          <div className="neon-db-badge card-subtle">
            <div className="neon-badge-header">
              <DatabaseOutlined className="text-brand-primary" />
              <span>Neon Postgres Cloud Storage</span>
            </div>
            <p className="neon-badge-text">
              Saves your calibrated interview scorecards, recordings, and custom prompts securely across all your devices.
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <>
                  <span className="spinner-sm"></span> Authenticating...
                </>
              ) : tab === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRightOutlined />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRightOutlined />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
