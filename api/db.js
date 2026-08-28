/**
 * Neon Serverless Postgres Connection & Schema Initialization
 * Supports Email/Password, GitHub/LinkedIn OAuth, Email OTPs, and User Feedback
 */

import { neon } from '@neondatabase/serverless';

let dbClient = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  if (!dbClient) {
    dbClient = neon(databaseUrl);
  }
  return dbClient;
}

/**
 * Auto-initialize database tables if not existing
 */
export async function initDb() {
  const sql = getDb();
  if (!sql) {
    console.warn('DATABASE_URL not set; running in local storage fallback mode.');
    return false;
  }

  try {
    // 1. Users Table (supports Email, GitHub OAuth & LinkedIn OAuth)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        auth_provider VARCHAR(32) DEFAULT 'email',
        provider_id VARCHAR(128),
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 2. Add columns if upgrading existing table
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(32) DEFAULT 'email';`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(128);`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`;
      await sql`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;`;
    } catch (e) {
      // Ignore if columns already exist
    }

    // 3. Interview Sessions Table
    await sql`
      CREATE TABLE IF NOT EXISTS interview_sessions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        track VARCHAR(64) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        average_score NUMERIC(3, 1),
        questions JSONB,
        evaluations JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 4. Email OTPs Table (Passwordless Sign-In via Resend)
    await sql`
      CREATE TABLE IF NOT EXISTS email_otps (
        email VARCHAR(255) PRIMARY KEY,
        code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      );
    `;

    // 5. User Feedback & Experience Ratings Table
    await sql`
      CREATE TABLE IF NOT EXISTS user_feedback (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        email VARCHAR(255),
        rating INTEGER,
        category VARCHAR(64),
        feedback_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON user_feedback(created_at DESC);`;

    return true;
  } catch (err) {
    console.error('Failed to initialize Neon DB schema:', err);
    return false;
  }
}
