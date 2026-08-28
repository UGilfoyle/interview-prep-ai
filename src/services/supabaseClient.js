import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uaysvwrwmlhcsebxcwlu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isSupabaseConfigured = () => Boolean(supabase);

/**
 * Sign in / Sign up with 6-digit OTP code (Supabase handles email delivery with 0 custom domain required!)
 */
export async function supabaseSendEmailOtp(email) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: {
      shouldCreateUser: true
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Verify 6-digit OTP code
 */
export async function supabaseVerifyOtp(email, token) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.toLowerCase().trim(),
    token: token.trim(),
    type: 'email'
  });
  if (error) throw error;
  return data;
}

/**
 * Direct Email + Password Sign Up
 */
export async function supabaseSignUpWithPassword({ email, password, name }) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: {
        full_name: name || email.split('@')[0]
      }
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Direct Email + Password Sign In
 */
export async function supabaseSignInWithPassword({ email, password }) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password
  });
  if (error) throw error;
  return data;
}

/**
 * 1-Click OAuth with GitHub / LinkedIn / Google
 */
export async function supabaseSignInWithOAuth(provider) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign Out
 */
export async function supabaseSignOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Get current session user
 */
export async function supabaseGetCurrentUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
    provider: session.user.app_metadata?.provider || 'supabase'
  };
}

/**
 * Save Interview Session to Supabase table (with automatic fallback)
 */
export async function saveInterviewSessionToSupabase(session) {
  if (!supabase) return null;
  try {
    const user = await supabaseGetCurrentUser();
    const { data, error } = await supabase.from('interview_sessions').upsert({
      id: session.id,
      user_id: user?.id || 'guest',
      track: session.track || 'pm',
      role: session.role || '',
      company: session.company || '',
      average_score: session.averageScore,
      questions: session.questions,
      evaluations: session.evaluations,
      created_at: session.timestamp || new Date().toISOString()
    });
    if (error) console.warn('Supabase session save notice:', error.message);
    return data;
  } catch (err) {
    console.warn('Could not sync to Supabase table:', err);
    return null;
  }
}

/**
 * Fetch past Interview Sessions from Supabase table
 */
export async function fetchInterviewSessionsFromSupabase() {
  if (!supabase) return [];
  try {
    const user = await supabaseGetCurrentUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return data.map((d) => ({
      id: d.id,
      track: d.track,
      role: d.role,
      company: d.company,
      averageScore: d.average_score,
      questions: d.questions,
      evaluations: d.evaluations,
      timestamp: d.created_at
    }));
  } catch (err) {
    return [];
  }
}
