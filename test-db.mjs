import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:Amadeo0511%21%21@db.emepyzonafiqjzfthchg.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

try {
  const res = await pool.query('SELECT version()');
  console.log('✓ Connected:', res.rows[0].version);
  process.exit(0);
} catch (err) {
  console.error('✗ Connection failed:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.error('  → Database server is not reachable');
  }
  process.exit(1);
}
