/**
 * Neon Serverless Postgres Connection & Schema Initialization
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
    // 1. Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 2. Interview Sessions Table
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

    // Index on user_id
    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id);
    `;

    return true;
  } catch (err) {
    console.error('Failed to initialize Neon DB schema:', err);
    return false;
  }
}
