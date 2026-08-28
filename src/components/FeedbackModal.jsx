import React, { useState } from 'react';
import {
  StarFilled,
  StarOutlined,
  MessageOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  SendOutlined,
  MailOutlined
} from '@ant-design/icons';
import { submitPlatformFeedback } from '../services/authService';

const CATEGORIES = [
  'General Experience',
  'AI Rubric Accuracy & Quality',
  'Voice / Speech-to-Text',
  'Request New Role Track',
  'Bug / Issue Report'
];

export function FeedbackModal({
  isOpen,
  onClose,
  user
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitPlatformFeedback({
        rating,
        category,
        feedbackText,
        email: email.trim()
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackText('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="feedback-modal card">
        <div className="modal-header">
          <div className="modal-title-group">
            <MessageOutlined style={{ fontSize: '20px' }} className="text-brand-primary" />
            <div>
              <h3 className="modal-title">Share Your Feedback</h3>
              <p className="modal-subtitle">Help us improve the tech interview preparation experience</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <CloseOutlined />
          </button>
        </div>

        {submitted ? (
          <div className="modal-body text-center animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
            <CheckCircleOutlined style={{ fontSize: '48px' }} className="text-success" />
            <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1.25rem' }}>Thank You for Your Feedback!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Your suggestions help shape new role tracks and elevate the Gemini AI evaluation quality.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            {/* Star Rating */}
            <div className="form-group text-center">
              <label className="form-label" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                How was your interview practice experience?
              </label>
              <div className="star-rating-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {(hoverRating || rating) >= star ? (
                      <StarFilled style={{ fontSize: '28px', color: '#f59e0b' }} />
                    ) : (
                      <StarOutlined style={{ fontSize: '28px', color: '#cbd5e1' }} />
                    )}
                  </button>
                ))}
              </div>
              <span className="rating-label">
                {rating === 5 && 'Outstanding & Realistic'}
                {rating === 4 && 'Very Good & Helpful'}
                {rating === 3 && 'Average / Needs Refinement'}
                {rating === 2 && 'Below Expectations'}
                {rating === 1 && 'Needs Major Fixes'}
              </span>
            </div>

            {/* Category Selector Chips */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="chip-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`chip-btn ${category === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Feedback Textarea */}
            <div className="form-group">
              <label className="form-label" htmlFor="feedback-text">
                Your Thoughts, Suggestions or Feature Requests <span className="required-star">*</span>
              </label>
              <textarea
                id="feedback-text"
                className="input-base"
                rows={4}
                placeholder="What did you like? What was missing? Would you like a specific new role track (e.g. Data Science, ML Engineering, DevOps)?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Optional Email */}
            {!user && (
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-email">
                  Your Email (Optional, if you'd like a response)
                </label>
                <div className="input-with-icon">
                  <MailOutlined className="input-icon" />
                  <input
                    id="feedback-email"
                    type="email"
                    className="input-base with-icon"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="key-status-banner status-error">
                <span>{error}</span>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span> Submitting...
                  </>
                ) : (
                  <>
                    <span>Send Feedback</span>
                    <SendOutlined />
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
