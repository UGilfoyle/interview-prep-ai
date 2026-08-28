import React, { useState } from 'react';
import {
  SafetyCertificateOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { testApiKey, DEFAULT_GEMINI_KEY } from '../services/geminiService';

export function SettingsModal({
  apiKey,
  setApiKey,
  onClose
}) {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const handleTestKey = async () => {
    if (!tempKey.trim()) {
      setTestStatus({ success: false, message: 'Please enter an API key.' });
      return;
    }
    setIsTesting(true);
    setTestStatus(null);
    const res = await testApiKey(tempKey);
    setIsTesting(false);
    setTestStatus(res);
  };

  const handleSave = () => {
    setApiKey(tempKey.trim());
    onClose();
  };

  const handleResetDefault = () => {
    setTempKey(DEFAULT_GEMINI_KEY);
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="settings-modal card">
        <div className="modal-header">
          <div className="modal-title-group">
            <SafetyCertificateOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />
            <div>
              <h3 className="modal-title">Gemini API Settings</h3>
              <p className="modal-subtitle">Configure your Google Gemini API key</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        <div className="settings-modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="settings-api-key">
              Gemini API Key:
            </label>
            <div className="input-with-actions">
              <div className="input-with-icon full-width">
                <KeyOutlined className="input-icon" />
                <input
                  id="settings-api-key"
                  type={showKey ? 'text' : 'password'}
                  className="input-base with-icon with-end-btn font-mono"
                  placeholder="Enter your Gemini API key (e.g. AIzaSy...)"
                  value={tempKey}
                  onChange={(e) => {
                    setTempKey(e.target.value);
                    setTestStatus(null);
                  }}
                />
              </div>
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
          </div>

          <div className="settings-actions-row">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !tempKey.trim()}
              className="btn btn-secondary btn-sm"
            >
              {isTesting ? (
                <>
                  <span className="spinner-sm"></span> Testing...
                </>
              ) : (
                <>
                  <ThunderboltOutlined className="text-brand-primary" /> Test Connection
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetDefault}
              className="btn btn-ghost btn-sm"
            >
              Reset to Provided Key
            </button>
          </div>

          {/* Test Status Banner */}
          {testStatus && (
            <div
              className={`key-status-banner ${
                testStatus.success ? 'status-success' : 'status-error'
              } animate-fade-in`}
            >
              {testStatus.success ? (
                <>
                  <CheckCircleOutlined className="text-success" />
                  <span>
                    Active & Valid ({testStatus.model || 'gemini-3.6-flash'} &bull; {testStatus.latency}ms)
                  </span>
                </>
              ) : (
                <>
                  <CloseCircleOutlined className="text-danger" />
                  <span>{testStatus.error || testStatus.message}</span>
                </>
              )}
            </div>
          )}

          <div className="settings-info-box card-subtle">
            <h4>Models & Security</h4>
            <p>
              InterviewPrep AI utilizes Google Gemini 3.6 Flash / 3.7 Flash with streaming JSON schema evaluation. Your API key is stored only in your local browser storage and is sent directly to Google's API endpoints.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
