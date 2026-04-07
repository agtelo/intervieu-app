import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a single postgres instance
const sql = postgres(process.env.DATABASE_URL, {
  prepare: false, // Disable prepared statements for better compatibility
});

export { sql };
