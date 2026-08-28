import React, { useState } from 'react';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  DatabaseOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  ArrowRightOutlined,
  GithubOutlined,
  LinkedinOutlined,
  KeyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import {
  loginUser,
  registerUser,
  startOAuthFlow,
  sendEmailOtp,
  verifyEmailOtp
} from '../services/authService';

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess
}) {
  const [method, setMethod] = useState('otp'); // 'otp' | 'password'
  const [tab, setTab] = useState('login'); // 'login' | 'register' (when using password)
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  // General states
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null); // 'github' | 'linkedin'
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  if (!isOpen) return null;

  // 1. Handle OAuth (GitHub / LinkedIn)
  const handleOAuthLogin = async (provider) => {
    setError(null);
    setSuccessNotice(null);
    setOauthLoading(provider);

    try {
      const user = await startOAuthFlow(provider);
      if (user) {
        setSuccessNotice(`Welcome, ${user.name || user.email}! Connected via ${provider === 'github' ? 'GitHub' : 'LinkedIn'}.`);
        onAuthSuccess(user);
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      setError(err.message || `${provider} authentication failed.`);
    } finally {
      setOauthLoading(null);
    }
  };

  // 2. Handle Send OTP Code via Resend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSendingOtp(true);
    setError(null);
    setSuccessNotice(null);

    try {
      const res = await sendEmailOtp(email.trim());
      setOtpSent(true);
      setSuccessNotice(`Verification code sent to ${email.trim()} via Resend.`);
      if (res.previewCode) {
        setSuccessNotice(`Verification code: ${res.previewCode}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 3. Handle Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setError(null);

    try {
      const res = await verifyEmailOtp({
        email: email.trim(),
        code: otpCode.trim(),
        name: name.trim()
      });
      setSuccessNotice(`Welcome, ${res.user.name || res.user.email}!`);
      onAuthSuccess(res.user);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 4. Handle Direct Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      if (tab === 'register') {
        const res = await registerUser({ email, password, name });
        if (res.notice) setSuccessNotice(res.notice);
        onAuthSuccess(res.user);
        setTimeout(() => onClose(), 1000);
      } else {
        const res = await loginUser({ email, password });
        if (res.notice) setSuccessNotice(res.notice);
        onAuthSuccess(res.user);
        setTimeout(() => onClose(), 1000);
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
              <h3 className="modal-title">Sign In to InterviewPrep AI</h3>
              <p className="modal-subtitle">Sync your scores & progress with Neon Serverless Postgres</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        {/* 1-Click OAuth Providers */}
        <div className="oauth-buttons-container">
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading || oauthLoading !== null}
            className="btn btn-secondary oauth-btn oauth-github"
          >
            {oauthLoading === 'github' ? (
              <span className="spinner-sm"></span>
            ) : (
              <GithubOutlined style={{ fontSize: '18px' }} />
            )}
            <span>Continue with GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('linkedin')}
            disabled={loading || oauthLoading !== null}
            className="btn btn-secondary oauth-btn oauth-linkedin"
          >
            {oauthLoading === 'linkedin' ? (
              <span className="spinner-sm"></span>
            ) : (
              <LinkedinOutlined style={{ fontSize: '18px', color: '#0a66c2' }} />
            )}
            <span>Continue with LinkedIn</span>
          </button>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR WITH EMAIL</span>
        </div>

        {/* Email Mode Switcher (OTP Code vs Password) */}
        <div className="auth-tabs-bar">
          <button
            type="button"
            onClick={() => {
              setMethod('otp');
              setError(null);
            }}
            className={`auth-tab-btn ${method === 'otp' ? 'active' : ''}`}
          >
            Passwordless Code (Email OTP)
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('password');
              setError(null);
            }}
            className={`auth-tab-btn ${method === 'password' ? 'active' : ''}`}
          >
            Email & Password
          </button>
        </div>

        {/* MODE A: Passwordless Email OTP via Resend */}
        {method === 'otp' && (
          <div className="modal-body auth-form">
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label" htmlFor="otp-email">
                    Your Email Address
                  </label>
                  <div className="input-with-icon">
                    <MailOutlined className="input-icon" />
                    <input
                      id="otp-email"
                      type="email"
                      className="input-base with-icon"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="key-status-banner status-error">
                    <AlertOutlined />
                    <span>{error}</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSendingOtp} className="btn btn-primary">
                    {isSendingOtp ? (
                      <>
                        <span className="spinner-sm"></span> Sending Code...
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Code</span>
                        <ThunderboltOutlined />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="otp-sent-banner card-subtle">
                  <MailOutlined className="text-brand-primary" />
                  <span>
                    We sent a 6-digit code to <strong>{email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="btn-link-subtle"
                    style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
                  >
                    Change
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="otp-code">
                    Enter 6-Digit Code
                  </label>
                  <div className="input-with-icon">
                    <KeyOutlined className="input-icon" />
                    <input
                      id="otp-code"
                      type="text"
                      maxLength={6}
                      className="input-base with-icon font-mono"
                      style={{ letterSpacing: '4px', fontSize: '1.2rem', textAlign: 'center' }}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="key-status-banner status-error">
                    <AlertOutlined />
                    <span>{error}</span>
                  </div>
                )}

                {successNotice && (
                  <div className="key-status-banner status-success">
                    <CheckCircleOutlined />
                    <span>{successNotice}</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpCode.length !== 6}
                    className="btn btn-primary"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <span className="spinner-sm"></span> Verifying...
                      </>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRightOutlined />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MODE B: Direct Email + Password */}
        {method === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="modal-body auth-form">
            <div className="password-subtabs">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`subtab-btn ${tab === 'login' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`subtab-btn ${tab === 'register' ? 'active' : ''}`}
              >
                Create Account
              </button>
            </div>

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
              <div className="key-status-banner status-error">
                <AlertOutlined />
                <span>{error}</span>
              </div>
            )}

            {successNotice && (
              <div className="key-status-banner status-success">
                <CheckCircleOutlined />
                <span>{successNotice}</span>
              </div>
            )}

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
        )}
      </div>
    </div>
  );
}
