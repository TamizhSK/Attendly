const prisma = require('./src/prismaClient');

async function testPrismaConnection() {
  try {
    console.log('Testing Prisma connection...');
    
    // Test basic connection
    const users = await prisma.user.findMany();
    console.log('✅ Prisma connection successful');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();