import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(200).json({ sessions: [], isGuest: true });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const sql = getDb();
    if (!sql) {
      return res.status(200).json({ sessions: [], isLocalMode: true });
    }

    await initDb();

    const sessions = await sql`
      SELECT id, track, role, company, average_score as "averageScore", questions, evaluations, created_at as "timestamp"
      FROM interview_sessions
      WHERE user_id = ${decoded.userId}
      ORDER BY created_at DESC
      LIMIT 50;
    `;

    return res.status(200).json({ sessions });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authentication' });
  }
}
