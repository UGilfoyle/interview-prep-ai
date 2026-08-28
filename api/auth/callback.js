/**
 * OAuth Callback Handler for Popup / Redirect
 */

import jwt from 'jsonwebtoken';
import { getDb, initDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interview_prep_ai_jwt_secret_default_2026';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

export default async function handler(req, res) {
  const { code, provider, error, error_description } = req.query;

  if (error) {
    return res.send(`
      <html>
        <body>
          <script>
            window.opener && window.opener.postMessage({ type: 'OAUTH_ERROR', error: '${error_description || error}' }, '*');
            window.close();
          </script>
          <p>Authentication canceled or failed. You may close this window.</p>
        </body>
      </html>
    `);
  }

  if (!code || !provider) {
    return res.status(400).send('Missing OAuth code or provider parameter');
  }

  try {
    let email = '';
    let name = '';
    let providerId = '';
    let avatarUrl = '';

    if (provider === 'github') {
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
      if (tokenData.error) throw new Error(tokenData.error_description || 'GitHub token exchange failed');

      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'InterviewPrep-AI' }
      });
      const userData = await userRes.json();

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
      if (tokenData.error) throw new Error(tokenData.error_description || 'LinkedIn token exchange failed');

      const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = await userRes.json();

      email = userData.email;
      name = userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim();
      providerId = userData.sub;
      avatarUrl = userData.picture || '';
    }

    // Upsert into Neon
    const sql = getDb();
    let userId = `usr_${provider}_${Date.now()}`;

    if (sql) {
      await initDb();
      const existing = await sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;
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

    const userPayload = JSON.stringify({ id: userId, email, name, avatarUrl, provider });

    // HTML with window.opener.postMessage to smoothly close popup and authenticate parent
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating...</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #ffffff; color: #0f172a; text-align: center; }
            .spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div>
            <div class="spinner"></div>
            <h3>Authentication Successful!</h3>
            <p>Connecting your ${provider === 'github' ? 'GitHub' : 'LinkedIn'} profile...</p>
          </div>
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
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Callback error:', err);
    res.setHeader('Content-Type', 'text/html');
    return res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h3 style="color: #dc2626;">Authentication Failed</h3>
          <p>${err.message}</p>
          <script>
            window.opener && window.opener.postMessage({ type: 'OAUTH_ERROR', error: '${err.message}' }, '*');
          </script>
        </body>
      </html>
    `);
  }
}
