import React from 'react';
import {
  HistoryOutlined,
  DeleteOutlined,
  CalendarOutlined,
  RightOutlined,
  CloseOutlined
} from '@ant-design/icons';

export function HistoryModal({
  history = [],
  onSelectSession,
  onClearHistory,
  onClose
}) {
  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="history-modal card">
        <div className="modal-header">
          <div className="modal-title-group">
            <HistoryOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />
            <div>
              <h3 className="modal-title">Past Practice Sessions</h3>
              <p className="modal-subtitle">Saved locally in your browser</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        <div className="history-modal-body">
          {history.length === 0 ? (
            <div className="empty-history-state">
              <HistoryOutlined style={{ fontSize: '40px' }} className="text-text-light empty-icon" />
              <h4>No Practice Sessions Yet</h4>
              <p>Complete your first interview round to track your scores and rubric evaluations over time.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((session, idx) => {
                const validScores = (session.evaluations || [])
                  .filter((e) => e && typeof e.score === 'number')
                  .map((e) => e.score);
                const avgScore = validScores.length
                  ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
                  : 'N/A';

                return (
                  <div key={session.id || idx} className="history-item-card card">
                    <div className="history-item-top">
                      <div>
                        <h4 className="history-role">
                          {session.role || 'Role'}{' '}
                          {session.company ? `@ ${session.company}` : ''}
                        </h4>
                        <div className="history-meta">
                          <CalendarOutlined />
                          <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                          <span>&bull;</span>
                          <span>{session.questions?.length || 0} Questions</span>
                        </div>
                      </div>

                      <div className="history-score-badge">
                        <span className="score-val">{avgScore}</span>
                        <span className="score-max">/ 10</span>
                      </div>
                    </div>

                    <div className="history-item-actions">
                      <button
                        onClick={() => {
                          onSelectSession(session);
                          onClose();
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <span>View Scorecard</span>
                        <RightOutlined />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="history-modal-footer">
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all practice history?')) {
                  onClearHistory();
                }
              }}
              className="btn btn-danger btn-sm"
            >
              <DeleteOutlined />
              <span>Clear History</span>
            </button>
          )}

          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
