import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  let userId = 'guest';
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      // Allow guest saving if token is invalid
    }
  }

  const { id, track, role, company, averageScore, questions, evaluations } = req.body || {};
  const sessionId = id || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const sql = getDb();
  if (!sql) {
    return res.status(200).json({
      success: true,
      sessionId,
      isLocalMode: true,
      message: 'Saved locally (Neon DATABASE_URL not set in environment)'
    });
  }

  try {
    await initDb();

    await sql`
      INSERT INTO interview_sessions (id, user_id, track, role, company, average_score, questions, evaluations, created_at)
      VALUES (
        ${sessionId},
        ${userId},
        ${track || 'pm'},
        ${role || ''},
        ${company || ''},
        ${typeof averageScore === 'number' ? averageScore : null},
        ${JSON.stringify(questions || [])},
        ${JSON.stringify(evaluations || [])},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        questions = EXCLUDED.questions,
        evaluations = EXCLUDED.evaluations,
        average_score = EXCLUDED.average_score;
    `;

    return res.status(200).json({
      success: true,
      sessionId,
      message: 'Session saved to Neon database'
    });
  } catch (err) {
    console.error('Session save error:', err);
    return res.status(500).json({ error: 'Failed to save session: ' + err.message });
  }
}
