import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { InterviewScreen } from './components/InterviewScreen';
import { ScorecardModal } from './components/ScorecardModal';
import { FrameworkGuideModal } from './components/FrameworkGuideModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import {
  DEFAULT_GEMINI_KEY,
  generateTailoredQuestion,
  evaluateCandidateAnswer
} from './services/geminiService';
import {
  getStoredUser,
  clearSessionAuth,
  saveInterviewSessionToCloud,
  fetchUserSessionsFromCloud
} from './services/authService';
import { ROLE_TRACKS } from './data/roleTracks';
import './App.css';

export function App() {
  // Navigation Screen
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'interview'

  // User Auth State (Neon Serverless Postgres)
  const [user, setUser] = useState(() => getStoredUser());

  // Selected Track (PM, SWE, Scrum Master)
  const [track, setTrack] = useState(() => localStorage.getItem('interview_track') || 'pm');

  // Track config
  const currentTrackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  // Configuration & Profile State
  const [role, setRole] = useState(() => localStorage.getItem('interview_role') || currentTrackConfig.defaultRole);
  const [company, setCompany] = useState(() => localStorage.getItem('interview_company') || currentTrackConfig.defaultCompany);
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem('interview_jd') || '');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pm_gemini_api_key') || DEFAULT_GEMINI_KEY);
  
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [loopLength, setLoopLength] = useState(5);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(4);

  // Active Interview Session State
  const [questionIndex, setQuestionIndex] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(currentTrackConfig.categories[0].id);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [sessionEvaluations, setSessionEvaluations] = useState([]);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  
  // Loading & Async Flags
  const [isInitializing, setIsInitializing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);

  // Modals
  const [showFrameworksModal, setShowFrameworksModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewingHistoricalSession, setViewingHistoricalSession] = useState(null);

  // History stored in localStorage + Neon Cloud
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('interview_history_all');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync cloud sessions on login
  useEffect(() => {
    if (user) {
      fetchUserSessionsFromCloud().then((cloudSessions) => {
        if (cloudSessions && cloudSessions.length > 0) {
          setHistory((prev) => {
            const combined = [...cloudSessions, ...prev.filter((p) => !cloudSessions.some((c) => c.id === p.id))];
            return combined.slice(0, 50);
          });
        }
      });
    }
  }, [user]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('interview_track', track);
  }, [track]);

  useEffect(() => {
    localStorage.setItem('interview_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('interview_company', company);
  }, [company]);

  useEffect(() => {
    localStorage.setItem('interview_jd', jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('pm_gemini_api_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('interview_history_all', JSON.stringify(history));
  }, [history]);

  // Determine category for index (1-based)
  const getCategoryForIndex = (idx) => {
    const cats = currentTrackConfig.categories;
    const rotationIndex = (idx - 1) % cats.length;
    return cats[rotationIndex].id;
  };

  const getNextCategory = (idx) => {
    const cats = currentTrackConfig.categories;
    const nextIdx = idx % cats.length;
    return cats[nextIdx].id;
  };

  // 1. Start Interview Handler
  const handleStartInterview = async () => {
    setIsInitializing(true);
    setCurrentEvaluation(null);
    setSessionQuestions([]);
    setSessionEvaluations([]);
    setQuestionIndex(1);

    const firstCat = getCategoryForIndex(1);
    setCurrentCategory(firstCat);

    try {
      const q = await generateTailoredQuestion({
        apiKey,
        track,
        role,
        company,
        jobDescription,
        category: firstCat,
        questionIndex: 1,
        totalQuestions: loopLength,
        difficulty: experienceLevel,
        previousQuestions: []
      });

      setCurrentQuestion(q);
      setSessionQuestions([q]);
      setCurrentScreen('interview');
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Could not start interview: ' + err.message);
    } finally {
      setIsInitializing(false);
    }
  };

  // 2. Evaluate Answer
  const handleEvaluateAnswer = async (userAnswer) => {
    if (!currentQuestion) return;
    setIsEvaluating(true);

    try {
      const evalResult = await evaluateCandidateAnswer({
        apiKey,
        track,
        question: currentQuestion,
        answer: userAnswer,
        role,
        company,
        jobDescription,
        category: currentCategory,
        difficulty: experienceLevel
      });

      setCurrentEvaluation(evalResult);

      const updatedEvals = [...sessionEvaluations];
      updatedEvals[questionIndex - 1] = evalResult;
      setSessionEvaluations(updatedEvals);
    } catch (err) {
      console.error('Evaluation failed:', err);
      alert('Failed to evaluate answer: ' + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  // 3. Next Question
  const handleNextQuestion = async () => {
    const nextIndex = questionIndex + 1;
    const nextCat = getCategoryForIndex(nextIndex);

    setCurrentEvaluation(null);
    setQuestionIndex(nextIndex);
    setCurrentCategory(nextCat);
    setIsInitializing(true);

    const previousTitles = sessionQuestions.map((q) => q.title || q.question);

    try {
      const nextQ = await generateTailoredQuestion({
        apiKey,
        track,
        role,
        company,
        jobDescription,
        category: nextCat,
        questionIndex: nextIndex,
        totalQuestions: loopLength,
        difficulty: experienceLevel,
        previousQuestions: previousTitles
      });

      setCurrentQuestion(nextQ);
      setSessionQuestions((prev) => [...prev, nextQ]);
    } catch (err) {
      console.error('Failed to load next question:', err);
      alert('Could not load next question: ' + err.message);
    } finally {
      setIsInitializing(false);
    }
  };

  // 4. Skip Question
  const handleSkipQuestion = async () => {
    if (window.confirm('Skip this question and move to the next category?')) {
      handleNextQuestion();
    }
  };

  // 5. Complete Session & Sync to Neon
  const handleFinishSession = () => {
    const validScores = sessionEvaluations.filter((e) => e && typeof e.score === 'number').map((e) => e.score);
    const avg = validScores.length ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)) : null;

    const sessionRecord = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      track,
      role,
      company,
      averageScore: avg,
      questions: sessionQuestions,
      evaluations: sessionEvaluations
    };

    // Save locally
    setHistory((prev) => [sessionRecord, ...prev.slice(0, 49)]);
    setViewingHistoricalSession(sessionRecord);
    setShowScorecardModal(true);

    // Save to Neon Serverless Postgres in background
    saveInterviewSessionToCloud(sessionRecord);
  };

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    clearSessionAuth();
    setUser(null);
  };

  return (
    <div className="app-root">
      {/* Top Global Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        track={track}
        role={role}
        company={company}
        user={user}
        onOpenFrameworks={() => setShowFrameworksModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onEndSession={handleFinishSession}
        apiConnected={apiConnected}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentScreen === 'home' && (
          <HomeScreen
            track={track}
            setTrack={setTrack}
            role={role}
            setRole={setRole}
            company={company}
            setCompany={setCompany}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            apiKey={apiKey}
            setApiKey={setApiKey}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            loopLength={loopLength}
            setLoopLength={setLoopLength}
            timeLimitMinutes={timeLimitMinutes}
            setTimeLimitMinutes={setTimeLimitMinutes}
            onStartInterview={handleStartInterview}
            isLoading={isInitializing}
            historyCount={history.length}
          />
        )}

        {currentScreen === 'interview' && currentQuestion && (
          <InterviewScreen
            track={track}
            question={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={loopLength}
            category={currentCategory}
            role={role}
            company={company}
            jobDescription={jobDescription}
            apiKey={apiKey}
            difficulty={experienceLevel}
            timeLimitMinutes={timeLimitMinutes}
            onEvaluateAnswer={handleEvaluateAnswer}
            onNextQuestion={handleNextQuestion}
            onSkipQuestion={handleSkipQuestion}
            onFinishSession={handleFinishSession}
            isEvaluating={isEvaluating}
            evaluationFeedback={currentEvaluation}
            onRetryAnswer={() => setCurrentEvaluation(null)}
            nextCategory={questionIndex < loopLength ? getNextCategory(questionIndex) : null}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-text">
            InterviewPrep AI &bull; Google Gemini API &bull; Web Speech Recognition &bull; Neon Serverless Postgres
          </p>
          <div className="footer-links">
            <button
              onClick={() => setShowFrameworksModal(true)}
              className="footer-link-btn"
            >
              Frameworks Cheatsheet
            </button>
            <span className="footer-divider">&bull;</span>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="footer-link-btn"
            >
              Gemini API Config
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showFrameworksModal && (
        <FrameworkGuideModal
          initialTrack={track}
          onClose={() => setShowFrameworksModal(false)}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          history={history}
          onSelectSession={(sess) => {
            setViewingHistoricalSession(sess);
            setShowScorecardModal(true);
          }}
          onClearHistory={() => setHistory([])}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          apiKey={apiKey}
          setApiKey={setApiKey}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showScorecardModal && (
        <ScorecardModal
          sessionData={
            viewingHistoricalSession || {
              track,
              role,
              company,
              questions: sessionQuestions,
              evaluations: sessionEvaluations
            }
          }
          onStartNewRound={() => {
            setShowScorecardModal(false);
            setViewingHistoricalSession(null);
            setCurrentScreen('home');
          }}
          onClose={() => {
            setShowScorecardModal(false);
            setViewingHistoricalSession(null);
            setCurrentScreen('home');
          }}
        />
      )}
    </div>
  );
}
export default App;
