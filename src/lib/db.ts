import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a single postgres instance
// Add ?sslmode=require for Vercel/Supabase compatibility
const url = process.env.DATABASE_URL.includes('sslmode')
  ? process.env.DATABASE_URL
  : `${process.env.DATABASE_URL}?sslmode=require`;

export const db = postgres(url, {
  prepare: false,
});
