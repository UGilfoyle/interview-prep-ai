import React, { useState } from 'react';
import {
  CheckCircleOutlined,
  WarningOutlined,
  BulbOutlined,
  TrophyOutlined,
  SoundOutlined,
  MutedOutlined,
  RightOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
  BarChartOutlined,
  StarOutlined
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { TextToSpeechManager } from '../services/speechService';
import { ROLE_TRACKS } from '../data/roleTracks';

const tts = new TextToSpeechManager();

export function FeedbackCard({
  track = 'pm',
  feedback,
  question,
  userAnswer,
  onNextQuestion,
  onRetryAnswer,
  onFinishSession,
  isLastQuestion,
  nextCategoryName
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(true);
  const [showRubricDetails, setShowRubricDetails] = useState(false);

  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  // Trigger celebration confetti for strong scores
  React.useEffect(() => {
    if (feedback && feedback.score >= 8.5) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore in non-browser
      }
    }
  }, [feedback]);

  if (!feedback) return null;

  const {
    score = 7.0,
    verdict = 'Hire',
    summary = '',
    whatWasStrong = [],
    whatWasMissing = [],
    oneSpecificSuggestion = '',
    modelAnswer = '',
    rubricBreakdown = {}
  } = feedback;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      tts.stop();
      setIsPlayingAudio(false);
    } else {
      const speechText = `Evaluation for your answer. Overall verdict: ${verdict}, score ${score} out of 10. 
      What was strong: ${whatWasStrong.join('. ')}. 
      What was missing: ${whatWasMissing.join('. ')}. 
      Key suggestion: ${oneSpecificSuggestion}`;

      tts.speak(speechText, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false)
      });
    }
  };

  const getVerdictBadgeClass = (v) => {
    const lower = (v || '').toLowerCase();
    if (lower.includes('strong hire')) return 'badge-verdict-strong';
    if (lower.includes('lean no') || lower.includes('no hire')) return 'badge-verdict-reject';
    if (lower.includes('lean hire')) return 'badge-verdict-lean';
    return 'badge-verdict-hire';
  };

  const getScoreColor = (s) => {
    if (s >= 8.5) return 'var(--success)';
    if (s >= 7.0) return 'var(--brand-primary)';
    if (s >= 5.5) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="feedback-wrapper animate-fade-in">
      {/* 1. Header & Score Verdict Banner */}
      <div className="feedback-hero-card card">
        <div className="feedback-hero-content">
          <div className="feedback-score-badge-group">
            <div
              className="score-circle"
              style={{ borderColor: getScoreColor(score) }}
            >
              <span className="score-num" style={{ color: getScoreColor(score) }}>
                {score.toFixed(1)}
              </span>
              <span className="score-denom">/ 10</span>
            </div>
            <div className="verdict-info">
              <div className="verdict-header">
                <span className={`badge ${getVerdictBadgeClass(verdict)} verdict-tag`}>
                  {verdict}
                </span>
                <span className="eval-pill">{trackConfig.shortLabel} Bar Raiser Calibrated</span>
              </div>
              <p className="verdict-summary">{summary}</p>
            </div>
          </div>

          <div className="feedback-audio-action">
            <button
              onClick={handleToggleAudio}
              className={`btn btn-sm ${isPlayingAudio ? 'btn-danger' : 'btn-secondary'} audio-listen-btn`}
              title="Listen to voice feedback"
            >
              {isPlayingAudio ? (
                <>
                  <MutedOutlined /> Stop Voice
                </>
              ) : (
                <>
                  <SoundOutlined className="text-brand-primary" /> Listen to Feedback
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Main Feedback Pillars */}
      <div className="feedback-pillars-grid">
        {/* Pillar A: What Was Strong */}
        <div className="pillar-card card strong-card">
          <div className="pillar-header">
            <div className="pillar-icon bg-success-light text-success">
              <CheckCircleOutlined style={{ fontSize: '18px' }} />
            </div>
            <div>
              <h3 className="pillar-title">What Was Strong</h3>
              <p className="pillar-subtitle">Demonstrated competencies & clear execution</p>
            </div>
          </div>
          <ul className="pillar-list">
            {whatWasStrong.map((item, idx) => (
              <li key={idx} className="pillar-item">
                <span className="item-bullet bullet-success">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar B: What Was Missing */}
        <div className="pillar-card card missing-card">
          <div className="pillar-header">
            <div className="pillar-icon bg-warning-light text-warning">
              <WarningOutlined style={{ fontSize: '18px' }} />
            </div>
            <div>
              <h3 className="pillar-title">What Was Missing</h3>
              <p className="pillar-subtitle">Gaps, unstated assumptions & edge cases</p>
            </div>
          </div>
          <ul className="pillar-list">
            {whatWasMissing.map((item, idx) => (
              <li key={idx} className="pillar-item">
                <span className="item-bullet bullet-warning">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pillar C: One Specific High-Impact Suggestion */}
      <div className="coaching-suggestion-card card">
        <div className="coaching-icon-wrap">
          <BulbOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />
        </div>
        <div className="coaching-content">
          <div className="coaching-tag">High-Impact Coaching Tip</div>
          <p className="coaching-text">{oneSpecificSuggestion}</p>
        </div>
      </div>

      {/* 3. 5-Pillar Rubric Breakdown Accordion */}
      {rubricBreakdown && Object.keys(rubricBreakdown).length > 0 && (
        <div className="rubric-card card">
          <button
            type="button"
            className="rubric-toggle-btn"
            onClick={() => setShowRubricDetails(!showRubricDetails)}
          >
            <div className="rubric-toggle-left">
              <BarChartOutlined style={{ fontSize: '18px' }} className="text-brand-primary" />
              <span className="rubric-title">
                5-Pillar {trackConfig.shortLabel} Interview Rubric Breakdown
              </span>
            </div>
            <span className="rubric-arrow">
              {showRubricDetails ? <UpOutlined /> : <DownOutlined />}
            </span>
          </button>

          {showRubricDetails && (
            <div className="rubric-body animate-fade-in">
              <div className="rubric-grid">
                {Object.entries(rubricBreakdown).map(([key, data]) => {
                  const defaultLabelMap = {
                    structureAndClarity: 'Structure & Problem Framing',
                    userFocusAndEmpathy: 'Domain Depth & Technical Empathy',
                    analyticalAndMetricsRigor: 'Scalability & Analytical Rigor',
                    strategicVisionAndTradeoffs: 'Trade-offs & Resiliency',
                    deliveryAndConciseness: 'Communication & Conciseness'
                  };
                  const label = trackConfig.rubricPillars[key] || defaultLabelMap[key] || key;
                  const itemScore = data.score || 7;

                  return (
                    <div key={key} className="rubric-item">
                      <div className="rubric-item-header">
                        <span className="rubric-item-label">{label}</span>
                        <span className="rubric-item-score">{itemScore} / 10</span>
                      </div>
                      <div className="rubric-progress-bar">
                        <div
                          className="rubric-progress-fill"
                          style={{
                            width: `${(itemScore / 10) * 100}%`,
                            backgroundColor: getScoreColor(itemScore)
                          }}
                        ></div>
                      </div>
                      <p className="rubric-item-feedback">{data.feedback}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Exemplary Model Answer */}
      {modelAnswer && (
        <div className="model-answer-card card">
          <button
            type="button"
            className="model-answer-toggle-btn"
            onClick={() => setShowModelAnswer(!showModelAnswer)}
          >
            <div className="model-answer-toggle-left">
              <StarOutlined style={{ fontSize: '18px' }} className="text-brand-purple" />
              <div>
                <span className="model-answer-title">Exemplary Senior {trackConfig.shortLabel} Model Answer</span>
                <span className="model-answer-badge">Gold-Standard Benchmark Solution</span>
              </div>
            </div>
            <span className="model-answer-arrow">
              {showModelAnswer ? <UpOutlined /> : <DownOutlined />}
            </span>
          </button>

          {showModelAnswer && (
            <div className="model-answer-body animate-fade-in">
              <div className="model-answer-text">
                {modelAnswer.split('\n').map((line, i) => {
                  if (line.startsWith('###') || line.startsWith('##')) {
                    return (
                      <h4 key={i} className="model-heading">
                        {line.replace(/#/g, '').trim()}
                      </h4>
                    );
                  }
                  if (line.startsWith('-') || line.startsWith('*')) {
                    return (
                      <div key={i} className="model-bullet">
                        <span className="model-dot">&bull;</span>
                        <span>{line.substring(1).trim()}</span>
                      </div>
                    );
                  }
                  if (!line.trim()) {
                    return <div key={i} className="model-spacing"></div>;
                  }
                  return (
                    <p key={i} className="model-p">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Navigation & Next Actions Bar */}
      <div className="feedback-actions-bar card">
        <div className="actions-left">
          <button
            onClick={onRetryAnswer}
            className="btn btn-secondary btn-md"
            title="Refine answer with feedback in mind"
          >
            <ReloadOutlined />
            <span>Refine & Retry Answer</span>
          </button>
        </div>

        <div className="actions-right">
          {isLastQuestion ? (
            <button
              onClick={onFinishSession}
              className="btn btn-primary btn-lg finish-loop-btn"
            >
              <TrophyOutlined />
              <span>Complete Loop & View Scorecard</span>
            </button>
          ) : (
            <button
              onClick={onNextQuestion}
              className="btn btn-primary btn-lg next-q-btn"
            >
              <span>Next Question</span>
              {nextCategoryName && (
                <span className="next-cat-pill">({nextCategoryName})</span>
              )}
              <RightOutlined />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
