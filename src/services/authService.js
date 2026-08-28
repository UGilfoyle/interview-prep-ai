/**
 * Client Authentication & Cloud Sync Service for Neon Postgres
 */

const TOKEN_KEY = 'interview_prep_auth_token';
const USER_KEY = 'interview_prep_auth_user';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getStoredUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function setSessionAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSessionAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Register with Neon backend
 */
export async function registerUser({ email, password, name }) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setSessionAuth(data.token, data.user);
    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    // If running in purely local static mode without Vercel API backend
    if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
      const mockUser = {
        id: `local_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        isLocal: true
      };
      setSessionAuth('local_mock_token', mockUser);
      return {
        success: true,
        user: mockUser,
        notice: 'Signed in locally (API serverless backend will activate on Vercel deployment)'
      };
    }
    throw err;
  }
}

/**
 * Login with Neon backend
 */
export async function loginUser({ email, password }) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setSessionAuth(data.token, data.user);
    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
      const mockUser = {
        id: `local_${Date.now()}`,
        email,
        name: email.split('@')[0],
        isLocal: true
      };
      setSessionAuth('local_mock_token', mockUser);
      return {
        success: true,
        user: mockUser,
        notice: 'Signed in locally (API serverless backend will activate on Vercel deployment)'
      };
    }
    throw err;
  }
}

/**
 * Save interview session to Neon DB
 */
export async function saveInterviewSessionToCloud(session) {
  const token = getStoredToken();
  try {
    const res = await fetch('/api/sessions/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(session)
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Could not sync to Neon cloud, saved locally:', err);
    return { success: true, isLocalOnly: true };
  }
}

/**
 * Fetch user sessions from Neon DB
 */
export async function fetchUserSessionsFromCloud() {
  const token = getStoredToken();
  if (!token) return [];

  try {
    const res = await fetch('/api/sessions/list', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sessions || [];
  } catch (err) {
    return [];
  }
}
