import React, { useState } from 'react';
import {
  TrophyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CopyOutlined,
  CheckOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { ROLE_TRACKS } from '../data/roleTracks';

export function ScorecardModal({
  sessionData,
  onStartNewRound,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState(null);

  if (!sessionData || !sessionData.questions || sessionData.questions.length === 0) {
    return null;
  }

  const {
    track = 'pm',
    role,
    company,
    questions = [],
    evaluations = []
  } = sessionData;

  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  const validScores = evaluations.filter((e) => e && typeof e.score === 'number').map((e) => e.score);
  const averageScore = validScores.length
    ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1))
    : 0;

  const getOverallVerdict = (avg) => {
    if (avg >= 8.5) return { text: 'Strong Hire Loop', class: 'badge-verdict-strong', color: 'var(--success)' };
    if (avg >= 7.0) return { text: 'Hire Loop', class: 'badge-verdict-hire', color: 'var(--brand-primary)' };
    if (avg >= 5.5) return { text: 'Lean Hire Loop', class: 'badge-verdict-lean', color: 'var(--warning)' };
    return { text: 'Needs Practice', class: 'badge-verdict-reject', color: 'var(--danger)' };
  };

  const verdict = getOverallVerdict(averageScore);

  const allStrengths = evaluations.flatMap((e) => e?.whatWasStrong || []).slice(0, 6);
  const allMissing = evaluations.flatMap((e) => e?.whatWasMissing || []).slice(0, 6);

  const handleCopyReport = () => {
    const reportMarkdown = `# ${trackConfig.label} Interview Loop Scorecard - InterviewPrep AI
**Target Role:** ${role} ${company ? `@ ${company}` : ''}
**Track:** ${trackConfig.label}
**Date:** ${new Date().toLocaleDateString()}
**Overall Loop Score:** ${averageScore} / 10.0 (${verdict.text})

## Summary of Performance
### Key Strengths:
${allStrengths.map((s) => `- ${s}`).join('\n')}

### Critical Areas to Improve:
${allMissing.map((m) => `- ${m}`).join('\n')}

## Question-by-Question Breakdown:
${questions
  .map((q, idx) => {
    const evalData = evaluations[idx];
    return `### Q${idx + 1} [${q.category?.toUpperCase()}]: ${q.title || q.question}
**Score:** ${evalData?.score || 'N/A'} / 10 (${evalData?.verdict || 'N/A'})
**Key Coaching Tip:** ${evalData?.oneSpecificSuggestion || 'N/A'}
`;
  })
  .join('\n---\n')}
`;

    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="scorecard-modal card">
        {/* Modal Header */}
        <div className="scorecard-header">
          <div className="header-left">
            <div className="scorecard-icon">
              <TrophyOutlined style={{ fontSize: '22px' }} className="text-brand-primary" />
            </div>
            <div>
              <h2 className="scorecard-title">{trackConfig.shortLabel} Interview Scorecard</h2>
              <p className="scorecard-sub">
                {role} {company ? `@ ${company}` : ''} &bull; {questions.length} Questions Evaluated
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        <div className="scorecard-body">
          {/* 1. Overall Score Summary Banner */}
          <div className="scorecard-hero-banner card-subtle">
            <div className="hero-score-ring" style={{ borderColor: verdict.color }}>
              <span className="hero-score-val" style={{ color: verdict.color }}>
                {averageScore}
              </span>
              <span className="hero-score-max">/ 10</span>
            </div>
            <div className="hero-verdict-details">
              <div className="hero-badge-wrap">
                <span className={`badge ${verdict.class} verdict-tag`}>
                  {verdict.text}
                </span>
                <span className="eval-pill">{trackConfig.shortLabel} Bar Raiser Calibrated</span>
              </div>
              <p className="hero-summary-text">
                {averageScore >= 8.0
                  ? 'Outstanding performance across technical depth, structured communication, and trade-off analysis.'
                  : averageScore >= 6.5
                  ? 'Solid foundation. Focus on structuring edge cases and explicitly validating failure modes.'
                  : 'Good practice round. Focus on mastering standard frameworks and pacing your responses.'}
              </p>
            </div>
          </div>

          {/* 2. Key Synthesis Grid */}
          <div className="scorecard-synthesis-grid">
            <div className="synthesis-card card strong-card">
              <div className="synthesis-header">
                <CheckCircleOutlined className="text-success" />
                <h4>Top Demonstrated Strengths</h4>
              </div>
              <ul className="synthesis-list">
                {allStrengths.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>

            <div className="synthesis-card card missing-card">
              <div className="synthesis-header">
                <WarningOutlined className="text-warning" />
                <h4>Top Blindspots & Areas to Improve</h4>
              </div>
              <ul className="synthesis-list">
                {allMissing.map((m, i) => (
                  <li key={i}>&bull; {m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Question-by-Question Accordion List */}
          <div className="scorecard-questions-section">
            <h3 className="section-heading">Detailed Question Breakdown</h3>
            <div className="scorecard-q-list">
              {questions.map((q, idx) => {
                const evalData = evaluations[idx];
                const catMeta =
                  trackConfig.categories.find((c) => c.id === q.category) || trackConfig.categories[0];
                const isExpanded = expandedQuestionIdx === idx;

                return (
                  <div key={idx} className="scorecard-q-card card">
                    <div
                      className="scorecard-q-header"
                      onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                    >
                      <div className="q-header-left">
                        <span className={`badge ${catMeta.badgeClass}`}>
                          {catMeta.label}
                        </span>
                        <h4 className="q-header-title">
                          Q{idx + 1}: {q.title || q.question}
                        </h4>
                      </div>

                      <div className="q-header-right">
                        {evalData && (
                          <span
                            className="q-score-badge"
                            style={{
                              backgroundColor: evalData.score >= 8 ? 'var(--success-bg)' : 'var(--bg-muted)',
                              color: evalData.score >= 8 ? 'var(--success)' : 'var(--text-primary)'
                            }}
                          >
                            {evalData.score.toFixed(1)} / 10
                          </span>
                        )}
                        <span className="q-arrow">
                          {isExpanded ? <UpOutlined /> : <DownOutlined />}
                        </span>
                      </div>
                    </div>

                    {isExpanded && evalData && (
                      <div className="scorecard-q-expanded animate-fade-in">
                        <p className="q-full-text">
                          <strong>Question:</strong> {q.question}
                        </p>
                        <div className="q-suggestion-banner">
                          <strong>Top Coaching Tip:</strong> {evalData.oneSpecificSuggestion}
                        </div>
                        {evalData.modelAnswer && (
                          <details className="q-model-details">
                            <summary className="q-model-summary">View Gold-Standard Model Answer</summary>
                            <div className="q-model-content">
                              <pre className="model-pre">{evalData.modelAnswer}</pre>
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="scorecard-footer">
          <button onClick={handleCopyReport} className="btn btn-secondary btn-md">
            {copied ? (
              <>
                <CheckOutlined className="text-success" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <CopyOutlined />
                <span>Copy Markdown Report</span>
              </>
            )}
          </button>

          <button onClick={onStartNewRound} className="btn btn-primary btn-md">
            <ReloadOutlined />
            <span>Start Another Practice Loop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
