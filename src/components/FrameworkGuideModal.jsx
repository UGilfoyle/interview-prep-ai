import React, { useState } from 'react';
import {
  BookOutlined,
  CopyOutlined,
  CheckOutlined,
  CloseOutlined,
  AppstoreOutlined,
  CodeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { ALL_FRAMEWORKS, ROLE_TRACKS } from '../data/roleTracks';

export function FrameworkGuideModal({ initialTrack = 'pm', onClose }) {
  const [activeTrackTab, setActiveTrackTab] = useState(initialTrack);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState(() => {
    const first = ALL_FRAMEWORKS.find((f) => f.track === initialTrack);
    return first ? first.id : 'circles';
  });
  const [copiedId, setCopiedId] = useState(null);

  const trackFrameworks = ALL_FRAMEWORKS.filter((f) => f.track === activeTrackTab);
  const currentFramework =
    ALL_FRAMEWORKS.find((f) => f.id === selectedFrameworkId) || trackFrameworks[0] || ALL_FRAMEWORKS[0];

  const handleCopyTemplate = (fw) => {
    navigator.clipboard.writeText(fw.templateSnippet);
    setCopiedId(fw.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectTrack = (t) => {
    setActiveTrackTab(t);
    const firstInTrack = ALL_FRAMEWORKS.find((f) => f.track === t);
    if (firstInTrack) {
      setSelectedFrameworkId(firstInTrack.id);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="framework-modal card">
        <div className="modal-header">
          <div className="modal-title-group">
            <BookOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />
            <div>
              <h3 className="modal-title">Tech Interview Frameworks & Cheatsheet</h3>
              <p className="modal-subtitle">Proven frameworks for PMs, Software Engineers, and Scrum Masters</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        {/* Track Switcher Sub-Header */}
        <div className="framework-track-switch-bar">
          {Object.values(ROLE_TRACKS).map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTrack(t.id)}
              className={`framework-track-btn ${activeTrackTab === t.id ? 'active' : ''}`}
            >
              {t.id === 'pm' && <AppstoreOutlined />}
              {t.id === 'swe' && <CodeOutlined />}
              {t.id === 'scrum_master' && <TeamOutlined />}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Framework Selector Tabs */}
        <div className="framework-tabs-bar">
          {trackFrameworks.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setSelectedFrameworkId(fw.id)}
              className={`framework-tab-btn ${
                selectedFrameworkId === fw.id ? 'active' : ''
              }`}
            >
              {fw.name.replace(/\s*\(.*?\)\s*/g, '')}
            </button>
          ))}
        </div>

        <div className="framework-modal-body">
          <div className="framework-detail-header">
            <div>
              <h4 className="framework-detail-name">{currentFramework.name}</h4>
              <p className="framework-detail-desc">{currentFramework.description}</p>
            </div>
            <button
              onClick={() => handleCopyTemplate(currentFramework)}
              className="btn btn-secondary btn-sm"
            >
              {copiedId === currentFramework.id ? (
                <>
                  <CheckOutlined className="text-success" /> Copied Template
                </>
              ) : (
                <>
                  <CopyOutlined /> Copy Scratchpad Template
                </>
              )}
            </button>
          </div>

          {/* Structure Steps */}
          <div className="framework-steps-card card-subtle">
            <h5 className="steps-title">Framework Steps & Outline:</h5>
            <ul className="steps-list">
              {currentFramework.structure.map((step, idx) => (
                <li key={idx} className="step-item">
                  <span className="step-badge">{idx + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scratchpad Template Preview */}
          <div className="template-preview-card">
            <div className="template-preview-header">
              <span className="template-label">Scratchpad Template Preview:</span>
            </div>
            <pre className="template-pre">{currentFramework.templateSnippet}</pre>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Got it, Back to Interview
          </button>
        </div>
      </div>
    </div>
  );
}
