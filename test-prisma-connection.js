const { PrismaClient } = require('./src/generated/prisma/client');

console.log('🔍 Testing Prisma connection to Supabase...\n');
console.log('DATABASE_URL:', process.env.DATABASE_URL.split('@')[1] || 'NOT SET');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

(async () => {
  try {
    console.log('\n🧪 Attempting connection...');
    const sessionCount = await prisma.session.count();
    console.log('✅ Connected to Supabase');
    console.log('   Sessions in DB:', sessionCount);
  } catch (err) {
    console.error('❌ Connection failed');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);
    console.error('   Meta:', err.meta);
  } finally {
    await prisma.$disconnect();
  }
})();
