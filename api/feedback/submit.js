import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';
import { sendFeedbackNotification } from '../email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  let userId = 'anonymous';
  let userEmail = '';

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
      userEmail = decoded.email;
    } catch (e) {
      // Allow guest submission
    }
  }

  const { rating = 5, category = 'General Experience', feedbackText = '', email = '' } = req.body || {};
  const finalEmail = userEmail || email || 'Anonymous Candidate';

  if (!feedbackText || feedbackText.trim().length < 3) {
    return res.status(400).json({ error: 'Please write a brief feedback description.' });
  }

  const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const sql = getDb();

  if (sql) {
    try {
      await initDb();
      await sql`
        INSERT INTO user_feedback (id, user_id, email, rating, category, feedback_text, created_at)
        VALUES (${feedbackId}, ${userId}, ${finalEmail}, ${Number(rating)}, ${category}, ${feedbackText.trim()}, NOW());
      `;
    } catch (err) {
      console.error('Failed to save user feedback in Neon:', err);
    }
  }

  // Send admin notification via Resend in background
  try {
    sendFeedbackNotification({
      rating,
      category,
      feedbackText: feedbackText.trim(),
      userEmail: finalEmail
    });
  } catch (e) {
    // Ignore notification error
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you! Your feedback has been recorded.'
  });
}
