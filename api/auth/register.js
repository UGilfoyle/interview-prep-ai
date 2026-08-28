import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Email and password (min 6 chars) are required.' });
  }

  const sql = getDb();
  if (!sql) {
    return res.status(503).json({
      error: 'Neon DATABASE_URL is not configured in Vercel environment variables. Please add your Neon connection string.'
    });
  }

  try {
    await initDb();

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Insert user
    await sql`
      INSERT INTO users (id, email, password_hash, name, created_at)
      VALUES (${userId}, ${email.toLowerCase().trim()}, ${passwordHash}, ${name || ''}, NOW());
    `;

    const token = jwt.sign(
      { userId, email: email.toLowerCase().trim(), name: name || '' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send Welcome email via Resend in background if key is provided
    try {
      const { sendWelcomeEmail } = await import('../email.js');
      sendWelcomeEmail({ email: email.toLowerCase().trim(), name });
    } catch (e) {
      // Ignore background email error so registration is not blocked
    }

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        name: name || ''
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to register user: ' + err.message });
  }
}
