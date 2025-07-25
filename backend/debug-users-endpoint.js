const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('./src/prismaClient');

const app = express();
app.use(express.json());

// Test JWT verification
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6IlRlc3QgQWRtaW4iLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzNDI2MjMxLCJleHAiOjE3NTM1MTI2MzF9.WBrtMbPAV1egs8sglsP3HOaH_G0nBjrKRWejqVK1sfk';

async function debugUsersEndpoint() {
  try {
    console.log('=== DEBUGGING USERS ENDPOINT ===');
    
    // Step 1: Test JWT verification
    console.log('\n1. Testing JWT verification...');
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    console.log('✅ JWT verified successfully');
    console.log('Decoded user:', { id: decoded.id, email: decoded.email, role: decoded.role });
    
    // Step 2: Test admin check
    console.log('\n2. Testing admin check...');
    if (decoded.role !== 'admin') {
      console.log('❌ User is not admin');
      return;
    }
    console.log('✅ User is admin');
    
    // Step 3: Test Prisma query
    console.log('\n3. Testing Prisma query...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('✅ Prisma query successful');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n=== DEBUG COMPLETE ===');
    
  } catch (error) {
    console.error('❌ Error in debug:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

debugUsersEndpoint();