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
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const sql = getDb();
    if (!sql) {
      return res.status(200).json({ user: decoded, isOfflineFallback: true });
    }

    await initDb();
    const users = await sql`
      SELECT id, email, name, created_at FROM users WHERE id = ${decoded.userId} LIMIT 1;
    `;

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user: users[0] });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
