import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

console.log('🔍 Testing Prisma + Supabase connection...\n');

// Test 1: Direct pg connection
console.log('1️⃣ Testing direct pg Pool connection...');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const res = await pool.query('SELECT version()');
  console.log('✅ Direct Pool connection works');
  console.log('   DB:', res.rows[0].version.split(',')[0]);
} catch (err) {
  console.error('❌ Direct Pool failed:', err.message);
  process.exit(1);
}

// Test 2: Prisma connection
console.log('\n2️⃣ Testing Prisma + PrismaPg adapter...');
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
  const sessionCount = await prisma.session.count();
  console.log('✅ Prisma connection works');
  console.log('   Sessions in DB:', sessionCount);
} catch (err) {
  console.error('❌ Prisma failed:', err.message);
  console.error('   Code:', err.code);
} finally {
  await prisma.$disconnect();
  await pool.end();
}

console.log('\n✅ All tests complete');
