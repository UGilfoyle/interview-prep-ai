import { getDb, initDb } from './db.js';

export default async function handler(req, res) {
  const sql = getDb();
  if (!sql) {
    return res.status(200).json({
      status: 'ok',
      database: 'not_configured',
      message: 'Running in frontend/local storage mode. To enable Neon Postgres, set DATABASE_URL in Vercel.'
    });
  }

  try {
    const start = performance.now();
    const result = await sql`SELECT 1 as connected;`;
    const latency = Math.round(performance.now() - start);

    return res.status(200).json({
      status: 'ok',
      database: 'neon_postgres_connected',
      latency: `${latency}ms`,
      result
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      database: 'neon_connection_failed',
      error: err.message
    });
  }
}
