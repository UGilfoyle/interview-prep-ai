import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code, name } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const sql = getDb();

  let isValid = false;
  if (sql) {
    try {
      await initDb();
      const records = await sql`
        SELECT code, expires_at FROM email_otps
        WHERE email = ${cleanEmail} AND expires_at > NOW()
        LIMIT 1;
      `;

      if (records.length > 0 && records[0].code === code.trim()) {
        isValid = true;
        // Delete used OTP
        await sql`DELETE FROM email_otps WHERE email = ${cleanEmail};`;
      }
    } catch (err) {
      console.error('OTP check error in Neon:', err);
    }
  } else {
    // If running in offline test mode
    isValid = code.trim().length === 6;
  }

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new code.' });
  }

  // Create or get user in Neon
  let userId = `usr_${Date.now()}`;
  let userName = name || cleanEmail.split('@')[0];

  if (sql) {
    try {
      const existing = await sql`
        SELECT id, email, name FROM users WHERE email = ${cleanEmail} LIMIT 1;
      `;

      if (existing.length > 0) {
        userId = existing[0].id;
        userName = existing[0].name || userName;
      } else {
        await sql`
          INSERT INTO users (id, email, name, auth_provider, created_at)
          VALUES (${userId}, ${cleanEmail}, ${userName}, 'email_otp', NOW());
        `;
      }
    } catch (e) {
      console.error('Error upserting user on OTP verify:', e);
    }
  }

  const token = jwt.sign(
    { userId, email: cleanEmail, name: userName, provider: 'email_otp' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.status(200).json({
    success: true,
    token,
    user: { id: userId, email: cleanEmail, name: userName, provider: 'email_otp' }
  });
}
