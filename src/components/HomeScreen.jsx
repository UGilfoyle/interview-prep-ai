import React, { useState } from 'react';
import {
  AppstoreOutlined,
  CodeOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  BankOutlined,
  FileTextOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
  TrophyOutlined,
  AudioOutlined,
  RiseOutlined,
  ClusterOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { testApiKey } from '../services/geminiService';
import { ROLE_TRACKS } from '../data/roleTracks';

const SAMPLE_JD = `About the Role:
We are seeking an experienced candidate to lead critical initiatives. You will partner across engineering, product, design, and operations to solve complex problems, deliver high-impact milestones, and elevate team performance.

Key Responsibilities:
- Formulate requirements, technical specifications, or agile sprint plans.
- Collaborate with stakeholders to resolve blockers and ensure predictable delivery.
- Drive continuous improvement and make balanced trade-off decisions under tight constraints.`;

export function HomeScreen({
  track = 'pm',
  setTrack,
  role,
  setRole,
  company,
  setCompany,
  jobDescription,
  setJobDescription,
  apiKey,
  setApiKey,
  experienceLevel,
  setExperienceLevel,
  loopLength,
  setLoopLength,
  timeLimitMinutes,
  setTimeLimitMinutes,
  onStartInterview,
  isLoading,
  historyCount = 0
}) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState(null);
  const [showJdAccordion, setShowJdAccordion] = useState(!!jobDescription);

  const currentTrackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setKeyTestStatus({ success: false, message: 'Please enter an API key first.' });
      return;
    }
    setIsTestingKey(true);
    setKeyTestStatus(null);
    const result = await testApiKey(apiKey);
    setIsTestingKey(false);
    setKeyTestStatus(result);
  };

  const handleTrackChange = (newTrack) => {
    setTrack(newTrack);
    const cfg = ROLE_TRACKS[newTrack];
    if (cfg) {
      setRole(cfg.defaultRole);
      setCompany(cfg.defaultCompany);
      if (cfg.experienceLevels && cfg.experienceLevels.length > 0) {
        const defaultLevel = cfg.experienceLevels.find((l) => l.id.includes('Senior') || l.id === 'Senior') || cfg.experienceLevels[0];
        setExperienceLevel(defaultLevel.id);
      }
    }
  };

  const handleInsertSampleJd = () => {
    setJobDescription(SAMPLE_JD);
    setShowJdAccordion(true);
  };

  const canStart = apiKey.trim().length > 5 && role.trim().length > 0;

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Header */}
      <div className="home-hero">
        <div className="hero-pill">
          <ThunderboltOutlined className="text-brand-primary" />
          <span>Professional Technical Interview Studio</span>
        </div>
        <h1 className="hero-title">
          Master Your Tech Interview with <span className="highlight-text">Gemini AI</span>
        </h1>
        <p className="hero-subtitle">
          Practice company-tailored interview loops for <strong>Product Managers</strong>, <strong>Software Engineers</strong>, and <strong>Scrum Masters</strong>. Speak or type your answers, and receive calibrated bar-raiser rubric feedback.
        </p>

        {/* 1. Track Selector Tab Bar with Ant Design Icons */}
        <div className="track-selector-bar">
          {Object.values(ROLE_TRACKS).map((t) => {
            const isActive = track === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTrackChange(t.id)}
                className={`track-tab-btn ${isActive ? 'active ' + t.badgeClass : ''}`}
              >
                {t.id === 'pm' && <AppstoreOutlined />}
                {t.id === 'swe' && <CodeOutlined />}
                {t.id === 'scrum_master' && <TeamOutlined />}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 5-Category Rotation Badges for Active Track */}
        <div className="category-strip">
          <span className="strip-label">5-Pillar Rotation:</span>
          {currentTrackConfig.categories.map((cat) => (
            <span key={cat.id} className={`badge ${cat.badgeClass}`}>
              {cat.label}
            </span>
          ))}
        </div>
      </div>

      {/* Main Setup Form Card */}
      <div className="home-card card">
        <div className="card-header-clean">
          <div className="card-header-icon">
            {track === 'pm' && <AppstoreOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />}
            {track === 'swe' && <CodeOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />}
            {track === 'scrum_master' && <TeamOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />}
          </div>
          <div>
            <h2 className="card-title">{currentTrackConfig.label} Interview Setup</h2>
            <p className="card-desc">
              {currentTrackConfig.description}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canStart && !isLoading) onStartInterview();
          }}
          className="setup-form"
        >
          {/* Target Role Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="role-input">
              <span className="label-text">
                Target Role <span className="required-star">*</span>
              </span>
              <span className="label-hint">e.g. {currentTrackConfig.defaultRole}</span>
            </label>
            <div className="input-with-icon">
              <AuditOutlined className="input-icon" />
              <input
                id="role-input"
                type="text"
                className="input-base with-icon"
                placeholder={`e.g. ${currentTrackConfig.defaultRole}`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            {/* Role Preset Chips */}
            <div className="chip-list">
              <span className="chip-label">Suggestions:</span>
              {currentTrackConfig.rolePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRole(preset)}
                  className={`chip-btn ${role === preset ? 'active' : ''}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Target Company Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="company-input">
              <span className="label-text">Target Company</span>
              <span className="label-hint">Tailors technical context and questions</span>
            </label>
            <div className="input-with-icon">
              <BankOutlined className="input-icon" />
              <input
                id="company-input"
                type="text"
                className="input-base with-icon"
                placeholder="e.g. Stripe, Google, Netflix, Spotify, Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Company Preset Chips */}
            <div className="chip-list">
              <span className="chip-label">Top Tech:</span>
              {currentTrackConfig.companyPresets.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setCompany(comp)}
                  className={`chip-btn ${company.toLowerCase() === comp.toLowerCase() ? 'active' : ''}`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Job Description Accordion */}
          <div className="form-group">
            <div className="accordion-header">
              <button
                type="button"
                className="accordion-toggle-btn"
                onClick={() => setShowJdAccordion(!showJdAccordion)}
              >
                <FileTextOutlined className="text-text-muted" />
                <span className="accordion-title">
                  Optional Job Description & Tech Stack{' '}
                  {jobDescription.trim() ? (
                    <span className="badge badge-success">Added</span>
                  ) : (
                    <span className="badge badge-neutral">Optional</span>
                  )}
                </span>
                <span className="accordion-arrow">
                  {showJdAccordion ? <UpOutlined /> : <DownOutlined />}
                </span>
              </button>

              {!jobDescription && (
                <button
                  type="button"
                  onClick={handleInsertSampleJd}
                  className="btn btn-ghost btn-sm text-brand-primary"
                >
                  Insert Sample JD
                </button>
              )}
            </div>

            {showJdAccordion && (
              <div className="accordion-body animate-fade-in">
                <textarea
                  className="input-base textarea-jd"
                  rows={4}
                  placeholder="Paste specific job requirements, technologies, or team context here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
                <div className="textarea-footer">
                  <span className="char-count">{jobDescription.length} characters</span>
                  {jobDescription && (
                    <button
                      type="button"
                      onClick={() => setJobDescription('')}
                      className="btn-link-danger"
                    >
                      Clear JD
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gemini API Key Field */}
          <div className="form-group api-key-card">
            <div className="api-key-header">
              <label className="form-label" htmlFor="api-key-input">
                <span className="label-text">
                  Gemini API Key <span className="required-star">*</span>
                </span>
                <span className="label-hint">Saved securely in browser local storage</span>
              </label>

              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTestingKey || !apiKey.trim()}
                className="btn btn-secondary btn-sm"
              >
                {isTestingKey ? (
                  <>
                    <span className="spinner-sm"></span> Testing...
                  </>
                ) : (
                  <>
                    <ThunderboltOutlined className="text-brand-primary" /> Test Connection
                  </>
                )}
              </button>
            </div>

            <div className="input-with-actions">
              <div className="input-with-icon full-width">
                <KeyOutlined className="input-icon" />
                <input
                  id="api-key-input"
                  type={showApiKey ? 'text' : 'password'}
                  className="input-base with-icon with-end-btn font-mono"
                  placeholder="Enter your Gemini API key (e.g. AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setKeyTestStatus(null);
                  }}
                  required
                />
              </div>
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? 'Hide API Key' : 'Show API Key'}
              >
                {showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>

            {/* Key Status Message */}
            {keyTestStatus && (
              <div
                className={`key-status-banner ${
                  keyTestStatus.success ? 'status-success' : 'status-error'
                } animate-fade-in`}
              >
                {keyTestStatus.success ? (
                  <>
                    <CheckCircleOutlined className="text-success" />
                    <span>
                      Connected to Gemini API ({keyTestStatus.model || 'gemini-3.6-flash'} &bull; {keyTestStatus.latency}ms latency)
                    </span>
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined className="text-danger" />
                    <span>{keyTestStatus.error || keyTestStatus.message}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Practice Settings Grid */}
          <div className="settings-grid">
            <div className="form-group-compact">
              <label className="compact-label">
                <TrophyOutlined />
                <span>Seniority Level</span>
              </label>
              <select
                className="input-base select-custom font-medium"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                {(currentTrackConfig.experienceLevels || []).map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-compact">
              <label className="compact-label">
                <UnorderedListOutlined />
                <span>Round Format</span>
              </label>
              <select
                className="input-base select-custom"
                value={loopLength}
                onChange={(e) => setLoopLength(Number(e.target.value))}
              >
                <option value={5}>Full 5-Question Loop (All 5 Pillars)</option>
                <option value={3}>3-Question Rapid Loop</option>
                <option value={10}>10-Question Comprehensive Loop</option>
                <option value={1}>Single Question Drill</option>
              </select>
            </div>

            <div className="form-group-compact">
              <label className="compact-label">
                <ClockCircleOutlined />
                <span>Question Target Time</span>
              </label>
              <select
                className="input-base select-custom"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              >
                <option value={4}>4 Minutes (Standard pace)</option>
                <option value={5}>5 Minutes (System design / In-depth)</option>
                <option value={3}>3 Minutes (Rapid fire)</option>
                <option value={0}>Untimed (Practice mode)</option>
              </select>
            </div>
          </div>

          {/* Start Interview Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={!canStart || isLoading}
              className="btn btn-primary btn-lg start-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating Tailored {currentTrackConfig.shortLabel} Loop...</span>
                </>
              ) : (
                <>
                  <span>Start {currentTrackConfig.shortLabel} Interview</span>
                  <ArrowRightOutlined />
                </>
              )}
            </button>
            <p className="start-guarantee">
              Rotates across all 5 core {currentTrackConfig.label} pillars with real-time speech-to-text and calibrated bar-raiser evaluations.
            </p>
          </div>
        </form>
      </div>

      {/* Feature Highlights Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon icon-blue">
            <ClusterOutlined style={{ fontSize: '18px' }} />
          </div>
          <h3 className="feature-title">Multi-Track AI Bar Raiser</h3>
          <p className="feature-desc">
            Tailored specifically for PMs (CIRCLES, Metrics), SWEs (System Design, Algorithms), and Scrum Masters (Facilitation, Impediments).
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon icon-green">
            <AudioOutlined style={{ fontSize: '18px' }} />
          </div>
          <h3 className="feature-title">Voice & Speech-to-Text</h3>
          <p className="feature-desc">
            Practice speaking naturally with integrated Web Speech API transcription. Real-time microphone listening captures your thought process.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon icon-purple">
            <TrophyOutlined style={{ fontSize: '18px' }} />
          </div>
          <h3 className="feature-title">Calibrated Scoring & Models</h3>
          <p className="feature-desc">
            Get 5-pillar rubric scoring, what was strong, what was missing, one high-impact coaching tip, and a gold-standard model answer.
          </p>
        </div>
      </div>
    </div>
  );
}
