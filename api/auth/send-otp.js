import { getDb, initDb } from '../db.js';
import { sendOtpEmail } from '../email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  // Generate random 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const sql = getDb();
  if (sql) {
    try {
      await initDb();
      await sql`
        INSERT INTO email_otps (email, code, expires_at)
        VALUES (${cleanEmail}, ${otpCode}, ${expiresAt})
        ON CONFLICT (email) DO UPDATE SET
          code = EXCLUDED.code,
          expires_at = EXCLUDED.expires_at;
      `;
    } catch (err) {
      console.error('Failed to store OTP in Neon:', err);
    }
  }

  // Send via Resend
  const emailResult = await sendOtpEmail({ email: cleanEmail, code: otpCode });

  return res.status(200).json({
    success: true,
    message: `Verification code sent to ${cleanEmail}`,
    simulated: emailResult.simulated ? true : false,
    previewCode: emailResult.simulated ? otpCode : undefined
  });
}
