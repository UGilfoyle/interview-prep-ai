import React from 'react';
import {
  AppstoreOutlined,
  CodeOutlined,
  TeamOutlined,
  BookOutlined,
  HistoryOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { ROLE_TRACKS } from '../data/roleTracks';

export function Navbar({
  currentScreen,
  track = 'pm',
  role,
  company,
  onOpenFrameworks,
  onOpenHistory,
  onOpenSettings,
  onOpenAuth,
  onEndSession,
  onLogout,
  user,
  apiConnected
}) {
  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo & Title */}
        <div className="navbar-brand">
          <div className="brand-icon">
            {track === 'swe' ? (
              <CodeOutlined style={{ fontSize: '18px' }} className="text-brand-primary" />
            ) : track === 'scrum_master' ? (
              <TeamOutlined style={{ fontSize: '18px' }} className="text-brand-primary" />
            ) : (
              <AppstoreOutlined style={{ fontSize: '18px' }} className="text-brand-primary" />
            )}
          </div>
          <div className="brand-text">
            <div className="brand-title">
              InterviewPrep <span className="brand-badge">AI</span>
            </div>
            <span className="brand-subtitle">PM &bull; SWE &bull; Scrum Master Studio</span>
          </div>

          {/* Active Session Context Badge */}
          {currentScreen === 'interview' && (role || company) && (
            <div className="session-context-pill">
              <span className="context-dot"></span>
              <span className="context-track-tag">[{trackConfig.shortLabel}]</span>
              <span className="context-text">
                {role} {company ? `@ ${company}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* User Auth Status / Neon Cloud Badge */}
          {user ? (
            <div className="user-profile-pill">
              <div className="user-avatar">
                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              <span className="user-name hidden-mobile">{user.name || user.email.split('@')[0]}</span>
              <button
                onClick={onLogout}
                className="user-logout-btn"
                title="Sign out of Neon account"
              >
                <LogoutOutlined />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary btn-sm auth-btn"
              title="Sign in with Neon Postgres"
            >
              <UserOutlined />
              <span>Sign In</span>
            </button>
          )}

          {/* API Status Indicator */}
          <button
            onClick={onOpenSettings}
            className={`api-status-btn ${apiConnected ? 'connected' : 'needs-key'}`}
            title="Gemini API Settings"
          >
            <SafetyCertificateOutlined />
            <span>{apiConnected ? 'Gemini Active' : 'API Key Setup'}</span>
          </button>

          {/* Framework Cheatsheet Button */}
          <button
            onClick={onOpenFrameworks}
            className="btn btn-ghost btn-sm nav-btn"
            title="Interview Frameworks (PM, SWE, Agile)"
          >
            <BookOutlined />
            <span className="hidden-mobile">Frameworks</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="btn btn-ghost btn-sm nav-btn"
            title="Past Practice Sessions"
          >
            <HistoryOutlined />
            <span className="hidden-mobile">History</span>
          </button>

          {/* Exit / End Session Button */}
          {currentScreen === 'interview' && (
            <button
              onClick={onEndSession}
              className="btn btn-danger btn-sm"
              title="End Current Interview Session"
            >
              <LogoutOutlined />
              <span>End Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
