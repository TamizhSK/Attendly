const axios = require('axios');

// Test script to verify the /api/auth/users endpoint
const testUsersEndpoint = async () => {
  console.log('Testing /api/auth/users endpoint...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthCheck = await axios.get('http://localhost:5000/api/auth/signup', {
      validateStatus: () => true // Accept any status code
    });
    console.log('✅ Server is running on port 5000');
    
    // Test 2: Try to access users endpoint without token
    console.log('\n2. Testing users endpoint without authentication...');
    try {
      await axios.get('http://localhost:5000/api/auth/users');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Authentication required (403) - as expected');
      } else {
        console.log('❌ Unexpected response:', error.response?.status, error.response?.data);
      }
    }
    
    // Test 3: Login as admin and get token
    console.log('\n3. Testing admin login...');
    
    // First, let's create an admin user if it doesn't exist
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Admin user already exists');
      } else {
        console.log('⚠️ Could not create admin user:', error.response?.data?.error);
      }
    }
    
    // Now login
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@test.com',
        password: 'admin123'
      });
      
      const token = loginResponse.data.token;
      console.log('✅ Admin login successful');
      console.log('User role:', loginResponse.data.user.role);
      
      // Test 4: Access users endpoint with admin token
      console.log('\n4. Testing users endpoint with admin token...');
      const usersResponse = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Users endpoint works!');
      console.log(`Found ${usersResponse.data.length} users:`);
      usersResponse.data.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
      });
      
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to backend server on port 5000');
      console.log('Make sure to start the backend server with: npm start');
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
};

// Run the test
testUsersEndpoint();