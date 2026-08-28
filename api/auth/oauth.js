/**
 * OAuth 2.0 Handler for GitHub and LinkedIn Authentication
 */

import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

export default async function handler(req, res) {
  const { provider, action, code, redirect_uri } = req.query || req.body || {};

  // 1. INITIATE REDIRECT
  if (action === 'authorize' || req.method === 'GET' && !code) {
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const callbackUrl = redirect_uri || `${protocol}://${host}/api/auth/callback?provider=${provider}`;

    if (provider === 'github') {
      if (!GITHUB_CLIENT_ID) {
        return res.status(400).json({
          error: 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Vercel environment variables.'
        });
      }
      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email`;
      return res.redirect(githubUrl);
    }

    if (provider === 'linkedin') {
      if (!LINKEDIN_CLIENT_ID) {
        return res.status(400).json({
          error: 'LinkedIn OAuth is not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in Vercel environment variables.'
        });
      }
      const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=openid%20profile%20email`;
      return res.redirect(linkedinUrl);
    }

    return res.status(400).json({ error: 'Unsupported provider: ' + provider });
  }

  // 2. DIRECT CODE EXCHANGE (POST)
  if (req.method === 'POST') {
    const { code, provider } = req.body;
    if (!code || !provider) {
      return res.status(400).json({ error: 'Missing authorization code or provider' });
    }

    try {
      let email = '';
      let name = '';
      let providerId = '';
      let avatarUrl = '';

      if (provider === 'github') {
        // Exchange GitHub token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code
          })
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description || 'GitHub OAuth failed');

        // Fetch User Info
        const userRes = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'InterviewPrep-AI' }
        });
        const userData = await userRes.json();

        // Fetch Email if private
        let userEmail = userData.email;
        if (!userEmail) {
          const emailRes = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'InterviewPrep-AI' }
          });
          const emails = await emailRes.json();
          const primary = emails.find((e) => e.primary && e.verified) || emails[0];
          userEmail = primary?.email;
        }

        email = userEmail || `${userData.login}@users.noreply.github.com`;
        name = userData.name || userData.login;
        providerId = String(userData.id);
        avatarUrl = userData.avatar_url || '';
      } else if (provider === 'linkedin') {
        // Exchange LinkedIn token
        const host = req.headers.host;
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const callbackUrl = `${protocol}://${host}/api/auth/callback?provider=linkedin`;

        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackUrl,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET
          })
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description || 'LinkedIn OAuth failed');

        // Fetch User Info via OpenID userinfo endpoint
        const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();

        email = userData.email;
        name = userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim();
        providerId = userData.sub;
        avatarUrl = userData.picture || '';
      }

      // Upsert into Neon Postgres
      const sql = getDb();
      let userId = `usr_oauth_${Date.now()}`;

      if (sql) {
        await initDb();
        const existing = await sql`
          SELECT id, email, name, avatar_url FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;
        `;

        if (existing.length > 0) {
          userId = existing[0].id;
          await sql`
            UPDATE users SET
              name = COALESCE(NULLIF(${name}, ''), name),
              avatar_url = COALESCE(NULLIF(${avatarUrl}, ''), avatar_url),
              auth_provider = ${provider},
              provider_id = ${providerId}
            WHERE id = ${userId};
          `;
        } else {
          await sql`
            INSERT INTO users (id, email, name, auth_provider, provider_id, avatar_url, created_at)
            VALUES (${userId}, ${email.toLowerCase().trim()}, ${name}, ${provider}, ${providerId}, ${avatarUrl}, NOW());
          `;
        }
      }

      const token = jwt.sign(
        { userId, email: email.toLowerCase().trim(), name, avatarUrl, provider },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: { id: userId, email, name, avatarUrl, provider }
      });
    } catch (err) {
      console.error('OAuth exchange error:', err);
      return res.status(500).json({ error: 'OAuth login failed: ' + err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
