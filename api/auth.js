import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../lib/db.js';
import { sendOtpEmail, sendWelcomeEmail } from '../lib/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

export default async function handler(req, res) {
  // Determine subroute from query path or url
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = req.query.path || url.pathname.replace(/^\/api\/auth\/?/, '');

  const sql = getDb();
  if (sql) {
    await initDb();
  }

  // 1. REGISTER: POST /api/auth/register
  if (path === 'register' && req.method === 'POST') {
    const { email, password, name } = req.body || {};
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email and password (min 6 chars) are required.' });
    }

    if (!sql) {
      return res.status(503).json({ error: 'Neon DATABASE_URL is not configured.' });
    }

    try {
      const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;`;
      if (existing.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      await sql`
        INSERT INTO users (id, email, password_hash, name, created_at)
        VALUES (${userId}, ${email.toLowerCase().trim()}, ${passwordHash}, ${name || ''}, NOW());
      `;

      const token = jwt.sign({ userId, email: email.toLowerCase().trim(), name: name || '' }, JWT_SECRET, { expiresIn: '30d' });

      // Welcome Email in background
      try { sendWelcomeEmail({ email: email.toLowerCase().trim(), name }); } catch (e) {}

      return res.status(201).json({
        success: true,
        token,
        user: { id: userId, email: email.toLowerCase().trim(), name: name || '' }
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to register: ' + err.message });
    }
  }

  // 2. LOGIN: POST /api/auth/login
  if (path === 'login' && req.method === 'POST') {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!sql) {
      return res.status(503).json({ error: 'Neon DATABASE_URL is not configured.' });
    }

    try {
      const users = await sql`SELECT id, email, password_hash, name FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;`;
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      return res.status(500).json({ error: 'Login error: ' + err.message });
    }
  }

  // 3. SEND OTP: POST /api/auth/send-otp
  if (path === 'send-otp' && req.method === 'POST') {
    const { email } = req.body || {};
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (sql) {
      try {
        await sql`
          INSERT INTO email_otps (email, code, expires_at)
          VALUES (${cleanEmail}, ${otpCode}, ${expiresAt})
          ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at;
        `;
      } catch (err) {}
    }

    const emailResult = await sendOtpEmail({ email: cleanEmail, code: otpCode });
    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      simulated: emailResult.simulated ? true : false,
      previewCode: emailResult.simulated ? otpCode : undefined
    });
  }

  // 4. VERIFY OTP: POST /api/auth/verify-otp
  if (path === 'verify-otp' && req.method === 'POST') {
    const { email, code, name } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and 6-digit code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let isValid = false;

    if (sql) {
      try {
        const records = await sql`
          SELECT code, expires_at FROM email_otps WHERE email = ${cleanEmail} AND expires_at > NOW() LIMIT 1;
        `;
        if (records.length > 0 && records[0].code === code.trim()) {
          isValid = true;
          await sql`DELETE FROM email_otps WHERE email = ${cleanEmail};`;
        }
      } catch (e) {}
    } else {
      isValid = code.trim().length === 6;
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    let userId = `usr_${Date.now()}`;
    let userName = name || cleanEmail.split('@')[0];

    if (sql) {
      try {
        const existing = await sql`SELECT id, email, name FROM users WHERE email = ${cleanEmail} LIMIT 1;`;
        if (existing.length > 0) {
          userId = existing[0].id;
          userName = existing[0].name || userName;
        } else {
          await sql`
            INSERT INTO users (id, email, name, auth_provider, created_at)
            VALUES (${userId}, ${cleanEmail}, ${userName}, 'email_otp', NOW());
          `;
          try { sendWelcomeEmail({ email: cleanEmail, name: userName }); } catch (e) {}
        }
      } catch (e) {}
    }

    const token = jwt.sign({ userId, email: cleanEmail, name: userName, provider: 'email_otp' }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({ success: true, token, user: { id: userId, email: cleanEmail, name: userName, provider: 'email_otp' } });
  }

  // 5. OAUTH INITIATE: GET /api/auth/oauth
  if (path === 'oauth' && (req.query.action === 'authorize' || req.method === 'GET' && !req.query.code)) {
    const provider = req.query.provider;
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const callbackUrl = `${protocol}://${host}/api/auth/callback?provider=${provider}`;

    if (provider === 'github') {
      if (!GITHUB_CLIENT_ID) return res.status(400).json({ error: 'GITHUB_CLIENT_ID not configured in Vercel.' });
      return res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email`);
    }

    if (provider === 'linkedin') {
      if (!LINKEDIN_CLIENT_ID) return res.status(400).json({ error: 'LINKEDIN_CLIENT_ID not configured in Vercel.' });
      return res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=openid%20profile%20email`);
    }

    return res.status(400).json({ error: 'Unsupported provider' });
  }

  // 6. OAUTH CALLBACK: GET /api/auth/callback
  if (path === 'callback') {
    const { code, provider, error } = req.query;
    if (error || !code || !provider) {
      res.setHeader('Content-Type', 'text/html');
      return res.send(`<html><body><script>window.opener && window.opener.postMessage({ type: 'OAUTH_ERROR', error: '${error || "OAuth failed"}' }, '*'); window.close();</script></body></html>`);
    }

    try {
      let email = '';
      let name = '';
      let providerId = '';
      let avatarUrl = '';

      if (provider === 'github') {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code })
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description || 'GitHub OAuth failed');

        const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'InterviewPrep-AI' } });
        const userData = await userRes.json();

        let userEmail = userData.email;
        if (!userEmail) {
          const emailRes = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'InterviewPrep-AI' } });
          const emails = await emailRes.json();
          const primary = emails.find((e) => e.primary && e.verified) || emails[0];
          userEmail = primary?.email;
        }

        email = userEmail || `${userData.login}@users.noreply.github.com`;
        name = userData.name || userData.login;
        providerId = String(userData.id);
        avatarUrl = userData.avatar_url || '';
      } else if (provider === 'linkedin') {
        const host = req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const callbackUrl = `${protocol}://${host}/api/auth/callback?provider=linkedin`;

        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: callbackUrl, client_id: LINKEDIN_CLIENT_ID, client_secret: LINKEDIN_CLIENT_SECRET })
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description || 'LinkedIn OAuth failed');

        const userRes = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
        const userData = await userRes.json();

        email = userData.email;
        name = userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim();
        providerId = userData.sub;
        avatarUrl = userData.picture || '';
      }

      let userId = `usr_${provider}_${Date.now()}`;
      if (sql) {
        const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;`;
        if (existing.length > 0) {
          userId = existing[0].id;
          await sql`UPDATE users SET name = ${name}, avatar_url = ${avatarUrl}, auth_provider = ${provider}, provider_id = ${providerId} WHERE id = ${userId};`;
        } else {
          await sql`INSERT INTO users (id, email, name, auth_provider, provider_id, avatar_url, created_at) VALUES (${userId}, ${email.toLowerCase().trim()}, ${name}, ${provider}, ${providerId}, ${avatarUrl}, NOW());`;
        }
      }

      const token = jwt.sign({ userId, email: email.toLowerCase().trim(), name, avatarUrl, provider }, JWT_SECRET, { expiresIn: '30d' });
      const userPayload = JSON.stringify({ id: userId, email, name, avatarUrl, provider });

      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <!DOCTYPE html><html><body>
          <script>
            const token = ${JSON.stringify(token)};
            const user = ${userPayload};
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_SUCCESS', token, user }, '*');
              setTimeout(() => window.close(), 600);
            } else {
              localStorage.setItem('interview_prep_auth_token', token);
              localStorage.setItem('interview_prep_auth_user', JSON.stringify(user));
              window.location.href = '/';
            }
          </script>
        </body></html>
      `);
    } catch (err) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(500).send(`<html><body><script>window.opener && window.opener.postMessage({ type: 'OAUTH_ERROR', error: '${err.message}' }, '*');</script><p>${err.message}</p></body></html>`);
    }
  }

  // 7. ME: GET /api/auth/me
  if (path === 'me' && req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({ user: decoded });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  return res.status(404).json({ error: 'Auth route not found' });
}
