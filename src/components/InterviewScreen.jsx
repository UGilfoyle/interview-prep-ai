import React, { useState, useEffect, useRef } from 'react';
import {
  AudioOutlined,
  AudioMutedOutlined,
  SendOutlined,
  SoundOutlined,
  MutedOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  CloseOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { SpeechRecognitionManager, TextToSpeechManager } from '../services/speechService';
import { askClarifyingQuestion } from '../services/geminiService';
import { ALL_FRAMEWORKS, ROLE_TRACKS } from '../data/roleTracks';
import { FeedbackCard } from './FeedbackCard';

const tts = new TextToSpeechManager();

export function InterviewScreen({
  track = 'pm',
  question,
  questionIndex,
  totalQuestions,
  category,
  role,
  company,
  jobDescription,
  apiKey,
  difficulty,
  timeLimitMinutes,
  onEvaluateAnswer,
  onNextQuestion,
  onSkipQuestion,
  onFinishSession,
  isEvaluating,
  evaluationFeedback,
  onRetryAnswer,
  nextCategory
}) {
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');
  const [speechError, setSpeechError] = useState(null);
  
  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Audio question playback
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  // Clarifying question state
  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [candidateClarifyInput, setCandidateClarifyInput] = useState('');
  const [isAskingClarification, setIsAskingClarification] = useState(false);
  const [clarificationHistory, setClarificationHistory] = useState([]);

  // Framework hints toggle
  const [showHints, setShowHints] = useState(false);

  const textareaRef = useRef(null);
  const speechManagerRef = useRef(null);

  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;
  const currentCatMeta = trackConfig.categories.find((c) => c.id === category) || trackConfig.categories[0];
  const nextCatMeta = nextCategory ? trackConfig.categories.find((c) => c.id === nextCategory) : null;

  // Frameworks matching current track
  const trackFrameworks = ALL_FRAMEWORKS.filter((f) => f.track === track);

  // Initialize Speech Recognition Manager
  useEffect(() => {
    speechManagerRef.current = new SpeechRecognitionManager({
      onTranscript: ({ final, interim, combined }) => {
        setAnswerText(combined);
        setInterimSpeech(interim);
      },
      onError: (msg) => {
        setSpeechError(msg);
        setIsRecording(false);
      },
      onStatusChange: (status) => {
        setIsRecording(status);
        if (!status) setInterimSpeech('');
      }
    });

    return () => {
      if (speechManagerRef.current) {
        speechManagerRef.current.stop();
      }
      tts.stop();
    };
  }, []);

  // Sync initial answer text
  useEffect(() => {
    if (speechManagerRef.current) {
      speechManagerRef.current.setInitialText(answerText);
    }
  }, [answerText]);

  // Reset timer & fields on new question
  useEffect(() => {
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setAnswerText('');
    setClarificationHistory([]);
    setSpeechError(null);
    tts.stop();
    setIsSpeakingQuestion(false);
  }, [question?.id]);

  // Stopwatch Interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !evaluationFeedback) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, evaluationFeedback]);

  // Toggle Microphone
  const handleToggleMic = () => {
    if (!speechManagerRef.current) return;
    setSpeechError(null);

    if (isRecording) {
      speechManagerRef.current.stop();
      setIsRecording(false);
      setInterimSpeech('');
    } else {
      const started = speechManagerRef.current.start(answerText);
      if (started) {
        setIsRecording(true);
      }
    }
  };

  // Toggle Question TTS Audio
  const handleToggleQuestionAudio = () => {
    if (isSpeakingQuestion) {
      tts.stop();
      setIsSpeakingQuestion(false);
    } else {
      const textToSpeak = `Here is your ${currentCatMeta.label} question: ${question.question}`;
      tts.speak(textToSpeak, {
        onStart: () => setIsSpeakingQuestion(true),
        onEnd: () => setIsSpeakingQuestion(false)
      });
    }
  };

  // Insert Framework Template into Answer Box
  const handleInsertTemplate = (frameworkId) => {
    const fw = ALL_FRAMEWORKS.find((f) => f.id === frameworkId);
    if (!fw) return;

    const newText = answerText
      ? `${answerText}\n\n${fw.templateSnippet}`
      : fw.templateSnippet;

    setAnswerText(newText);
    if (speechManagerRef.current) {
      speechManagerRef.current.setInitialText(newText);
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle Clarifying Question to Interviewer
  const handleAskClarification = async (e) => {
    e.preventDefault();
    if (!candidateClarifyInput.trim() || isAskingClarification) return;

    const userQ = candidateClarifyInput.trim();
    setCandidateClarifyInput('');
    setIsAskingClarification(true);

    try {
      const answer = await askClarifyingQuestion({
        apiKey,
        track,
        question,
        candidateClarification: userQ,
        role,
        company
      });

      setClarificationHistory((prev) => [
        ...prev,
        { question: userQ, answer: answer }
      ]);
    } catch (err) {
      setClarificationHistory((prev) => [
        ...prev,
        {
          question: userQ,
          answer: 'Interviewer: Proceed with reasonable assumptions based on industry standards.'
        }
      ]);
    } finally {
      setIsAskingClarification(false);
    }
  };

  // Handle Submit Answer
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isRecording && speechManagerRef.current) {
      speechManagerRef.current.stop();
      setIsRecording(false);
    }
    tts.stop();
    setIsSpeakingQuestion(false);
    onEvaluateAnswer(answerText);
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (answerText.trim().length >= 10 && !isEvaluating) {
        handleSubmit();
      }
    }
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const estimatedReadMinutes = (wordCount / 130).toFixed(1);

  // If evaluation feedback exists, show the feedback view
  if (evaluationFeedback) {
    return (
      <div className="interview-container animate-fade-in">
        {/* Breadcrumb Header */}
        <div className="interview-top-nav">
          <div className="top-nav-left">
            <span className={`badge ${currentCatMeta.badgeClass}`}>
              {currentCatMeta.label}
            </span>
            <span className="q-progress-text">
              Question {questionIndex} of {totalQuestions}
            </span>
          </div>
          <div className="top-nav-right">
            <span className="text-muted-tag">
              {role} {company ? `• ${company}` : ''}
            </span>
          </div>
        </div>

        {/* Minimized Question Context Card */}
        <div className="card question-summary-card">
          <div className="summary-q-header">
            <span className="summary-q-label">Interview Question:</span>
            <h3 className="summary-q-title">{question.title || question.question}</h3>
          </div>
          <p className="summary-q-full">{question.question}</p>
        </div>

        {/* Detailed Feedback & Rubric Card */}
        <FeedbackCard
          track={track}
          feedback={evaluationFeedback}
          question={question}
          userAnswer={answerText}
          onNextQuestion={onNextQuestion}
          onRetryAnswer={() => {
            onRetryAnswer();
            if (textareaRef.current) textareaRef.current.focus();
          }}
          onFinishSession={onFinishSession}
          isLastQuestion={questionIndex >= totalQuestions}
          nextCategoryName={nextCatMeta ? nextCatMeta.label : null}
        />
      </div>
    );
  }

  return (
    <div className="interview-container animate-fade-in">
      {/* 1. Header Bar: Progress, Category Badge, Timer */}
      <div className="interview-top-nav">
        <div className="top-nav-left">
          <span className={`badge ${currentCatMeta.badgeClass}`}>
            {currentCatMeta.label}
          </span>
          <span className="q-progress-text">
            Question {questionIndex} of {totalQuestions}
          </span>
        </div>

        <div className="top-nav-center">
          <div
            className={`timer-pill ${
              timeLimitMinutes > 0 && elapsedSeconds > timeLimitMinutes * 60
                ? 'timer-overtime'
                : ''
            }`}
          >
            <ClockCircleOutlined />
            <span className="timer-digits">{formatTimer(elapsedSeconds)}</span>
            {timeLimitMinutes > 0 && (
              <span className="timer-target">/ {timeLimitMinutes}:00 target</span>
            )}
          </div>
        </div>

        <div className="top-nav-right">
          <button
            onClick={() => setShowClarifyModal(true)}
            className="btn btn-secondary btn-sm clarify-btn"
            title="Ask the interviewer a clarifying question"
          >
            <MessageOutlined className="text-brand-primary" />
            <span>Ask Clarification</span>
            {clarificationHistory.length > 0 && (
              <span className="badge-counter">{clarificationHistory.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Question Card */}
      <div className="question-card card">
        <div className="question-card-header">
          <div className="question-title-group">
            <span className="question-eyebrow">
              {company ? `${company} ${trackConfig.shortLabel}` : `${trackConfig.label} Interview`}
            </span>
            <h2 className="question-text">{question.question}</h2>
          </div>

          <button
            onClick={handleToggleQuestionAudio}
            className={`btn btn-sm ${
              isSpeakingQuestion ? 'btn-danger' : 'btn-secondary'
            } question-audio-btn`}
            title="Listen to interviewer speak the question"
          >
            {isSpeakingQuestion ? (
              <>
                <MutedOutlined /> Stop Voice
              </>
            ) : (
              <>
                <SoundOutlined className="text-brand-primary" /> Read Question
              </>
            )}
          </button>
        </div>

        {/* Context / Why this matters */}
        {question.context && (
          <div className="question-context-box">
            <span className="context-label">Interviewer Context:</span> {question.context}
          </div>
        )}

        {/* Framework & Hints Bar */}
        <div className="question-hints-bar">
          <div className="framework-tip">
            <BookOutlined className="text-brand-primary" />
            <span>{currentCatMeta.frameworkTip}</span>
          </div>

          <button
            type="button"
            className="btn-link-subtle"
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Hide Hints' : 'Show Interview Hints'}
          </button>
        </div>

        {/* Expanded Hints */}
        {showHints && question.hints && question.hints.length > 0 && (
          <div className="hints-expanded-box animate-fade-in">
            <h4 className="hints-heading">Key Considerations for this Question:</h4>
            <ul className="hints-list">
              {question.hints.map((hint, idx) => (
                <li key={idx}>&bull; {hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. Clarifications Drawer / Log */}
      {clarificationHistory.length > 0 && (
        <div className="clarification-log-card card">
          <div className="clarification-log-title">
            <MessageOutlined className="text-brand-primary" />
            <span>Interviewer Clarifications</span>
          </div>
          <div className="clarification-log-list">
            {clarificationHistory.map((item, idx) => (
              <div key={idx} className="clarify-exchange">
                <div className="candidate-q">
                  <span className="speaker-tag candidate-tag">You asked:</span>
                  <span className="exchange-text">"{item.question}"</span>
                </div>
                <div className="interviewer-a">
                  <span className="speaker-tag interviewer-tag">Interviewer:</span>
                  <span className="exchange-text">{item.answer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Answer Workspace */}
      <div className="answer-workspace card">
        <div className="workspace-header">
          {/* Dynamic Track Framework Template Buttons */}
          <div className="framework-quick-pills">
            <span className="pills-label">Insert Framework:</span>
            {trackFrameworks.map((fw) => (
              <button
                key={fw.id}
                type="button"
                onClick={() => handleInsertTemplate(fw.id)}
                className="btn-template-pill"
                title={`Insert ${fw.name} template`}
              >
                + {fw.name.replace(/\s*\(.*?\)\s*/g, '')}
              </button>
            ))}
          </div>

          {/* Voice Speech-to-Text Button with Ant Design Mic Icon */}
          <div className="voice-controls">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`btn ${
                isRecording ? 'btn-danger recording-pulse' : 'btn-primary'
              } mic-main-btn`}
              title={
                isRecording
                  ? 'Click to stop recording'
                  : 'Click to start voice recording via Web Speech API'
              }
            >
              {isRecording ? (
                <>
                  <AudioMutedOutlined />
                  <span>Recording... (Click to Stop)</span>
                  <span className="live-wave">
                    <span className="wave-bar bar-1"></span>
                    <span className="wave-bar bar-2"></span>
                    <span className="wave-bar bar-3"></span>
                  </span>
                </>
              ) : (
                <>
                  <AudioOutlined />
                  <span>Speak Answer (Voice)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Speech Error Warning */}
        {speechError && (
          <div className="speech-error-banner animate-fade-in">
            <CloseCircleOutlined />
            <span>{speechError}</span>
            <button
              onClick={() => setSpeechError(null)}
              className="banner-close"
            >
              <CloseOutlined />
            </button>
          </div>
        )}

        {/* Main Textarea */}
        <div className="answer-input-wrapper">
          <textarea
            ref={textareaRef}
            className="input-base textarea-answer font-sans"
            rows={10}
            placeholder={`Type or click "Speak Answer" to transcribe your response...\n\nTip: Structure your thoughts clearly. State assumptions, architecture/framework steps, trade-offs, and metrics.`}
            value={answerText}
            onChange={(e) => {
              setAnswerText(e.target.value);
              if (speechManagerRef.current) {
                speechManagerRef.current.setInitialText(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
          ></textarea>

          {/* Recording live feedback strip */}
          {isRecording && (
            <div className="live-transcription-feed animate-fade-in">
              <span className="feed-dot"></span>
              <span className="feed-label">Live Transcribing:</span>
              <span className="feed-text">
                {interimSpeech || 'Listening to your voice...'}
              </span>
            </div>
          )}
        </div>

        {/* Workspace Footer */}
        <div className="workspace-footer">
          <div className="footer-stats">
            <span className="stat-item">
              <strong>{wordCount}</strong> words
            </span>
            <span className="stat-divider">&bull;</span>
            <span className="stat-item">~{estimatedReadMinutes} min spoken duration</span>
            <span className="stat-divider">&bull;</span>
            <span className="stat-hint hidden-mobile">
              Press <kbd>Cmd</kbd> + <kbd>Enter</kbd> to submit
            </span>
          </div>

          <div className="footer-actions">
            {answerText.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear your current answer?')) {
                    setAnswerText('');
                    if (speechManagerRef.current) {
                      speechManagerRef.current.setInitialText('');
                    }
                  }
                }}
                className="btn btn-ghost btn-sm"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={onSkipQuestion}
              className="btn btn-secondary btn-sm"
            >
              Skip Question
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isEvaluating || answerText.trim().length < 5}
              className="btn btn-primary btn-md submit-eval-btn"
            >
              {isEvaluating ? (
                <>
                  <span className="spinner-sm"></span>
                  <span>Gemini Bar Raiser Evaluating...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <SendOutlined />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Evaluating Loading Overlay */}
      {isEvaluating && (
        <div className="evaluation-loading-overlay animate-fade-in">
          <div className="loading-card card">
            <div className="loading-spinner-large"></div>
            <h3 className="loading-title">Evaluating Candidate Response</h3>
            <p className="loading-subtitle">
              Gemini AI is analyzing your response against {trackConfig.shortLabel} bar-raiser benchmarks...
            </p>
            <div className="loading-rubric-steps">
              <div className="loading-step">
                <CheckCircleOutlined className="text-success" />
                <span>Checking problem framing, requirements & architecture</span>
              </div>
              <div className="loading-step">
                <CheckCircleOutlined className="text-success" />
                <span>Assessing technical depth, domain rigor & edge cases</span>
              </div>
              <div className="loading-step">
                <CheckCircleOutlined className="text-success" />
                <span>Synthesizing strengths, omissions & actionable coaching tip</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Modal Dialog */}
      {showClarifyModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="modal-dialog card">
            <div className="modal-header">
              <div className="modal-title-group">
                <MessageOutlined className="text-brand-primary" style={{ fontSize: '18px' }} />
                <h3>Ask Clarifying Question to Interviewer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClarifyModal(false)}
                className="btn-close-modal"
              >
                <CloseOutlined />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">
                In real technical interviews, top candidates always clarify assumptions, scale constraints, target users, or team parameters before jumping into answers.
              </p>

              <form onSubmit={handleAskClarification}>
                <div className="form-group">
                  <label className="form-label" htmlFor="clarify-input">
                    Your Clarifying Question:
                  </label>
                  <input
                    id="clarify-input"
                    type="text"
                    className="input-base"
                    placeholder="e.g. What is the expected QPS? Are we optimizing for read or write heavy traffic?"
                    value={candidateClarifyInput}
                    onChange={(e) => setCandidateClarifyInput(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowClarifyModal(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isAskingClarification || !candidateClarifyInput.trim()}
                    className="btn btn-primary"
                  >
                    {isAskingClarification ? (
                      <>
                        <span className="spinner-sm"></span> Asking Interviewer...
                      </>
                    ) : (
                      <>
                        <span>Ask Interviewer</span>
                        <SendOutlined />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {clarificationHistory.length > 0 && (
                <div className="modal-history-section">
                  <h4 className="modal-history-title">Previous Clarifications:</h4>
                  {clarificationHistory.map((item, i) => (
                    <div key={i} className="modal-history-item">
                      <div className="history-q">
                        <strong>Q:</strong> {item.question}
                      </div>
                      <div className="history-a">
                        <strong>A:</strong> {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
