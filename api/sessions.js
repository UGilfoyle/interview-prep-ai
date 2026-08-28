import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = req.query.path || url.pathname.replace(/^\/api\/sessions\/?/, '');

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  let userId = 'guest';
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {}
  }

  const sql = getDb();
  if (sql) {
    await initDb();
  }

  // 1. SAVE: POST /api/sessions/save
  if ((path === 'save' || req.method === 'POST') && req.method === 'POST') {
    const { id, track, role, company, averageScore, questions, evaluations } = req.body || {};
    const sessionId = id || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    if (!sql) {
      return res.status(200).json({ success: true, sessionId, isLocalMode: true });
    }

    try {
      await sql`
        INSERT INTO interview_sessions (id, user_id, track, role, company, average_score, questions, evaluations, created_at)
        VALUES (${sessionId}, ${userId}, ${track || 'pm'}, ${role || ''}, ${company || ''}, ${typeof averageScore === 'number' ? averageScore : null}, ${JSON.stringify(questions || [])}, ${JSON.stringify(evaluations || [])}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          questions = EXCLUDED.questions,
          evaluations = EXCLUDED.evaluations,
          average_score = EXCLUDED.average_score;
      `;
      return res.status(200).json({ success: true, sessionId });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save session: ' + err.message });
    }
  }

  // 2. LIST: GET /api/sessions/list
  if (path === 'list' || req.method === 'GET') {
    if (!token || userId === 'guest') {
      return res.status(200).json({ sessions: [], isGuest: true });
    }

    if (!sql) {
      return res.status(200).json({ sessions: [], isLocalMode: true });
    }

    try {
      const sessions = await sql`
        SELECT id, track, role, company, average_score as "averageScore", questions, evaluations, created_at as "timestamp"
        FROM interview_sessions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 50;
      `;
      return res.status(200).json({ sessions });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to list sessions: ' + err.message });
    }
  }

  return res.status(404).json({ error: 'Sessions route not found' });
}
