const axios = require('axios');

// Test registration endpoints
const testRegistration = async () => {
  const baseURL = 'http://localhost:5001/api/auth';
  
  console.log('🧪 Testing User Registration Endpoints\n');

  // Test data for different user types
  const testUsers = [
    {
      name: 'Super Admin',
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@test.com',
        password: 'admin123456',
        phone: '+91-9999999999',
        role: 'super_master_admin'
      }
    },
    {
      name: 'Doctor',
      data: {
        firstName: 'Dr. Jane',
        lastName: 'Smith',
        email: 'doctor@test.com',
        password: 'doctor123456',
        phone: '+91-9999999998',
        role: 'doctor',
        clinicId: '507f1f77bcf86cd799439011', // Sample clinic ID
        specialization: 'General Medicine',
        licenseNumber: 'DOC-2024-TEST'
      }
    },
    {
      name: 'Patient',
      data: {
        firstName: 'John',
        lastName: 'Patient',
        email: 'patient@test.com',
        password: 'patient123456',
        phone: '+91-9999999997',
        role: 'patient',
        clinicId: '507f1f77bcf86cd799439011',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      }
    }
  ];

  for (const testUser of testUsers) {
    try {
      console.log(`📝 Testing ${testUser.name} Registration...`);
      
      // Test quick registration (no OTP)
      const response = await axios.post(`${baseURL}/quick-register`, testUser.data);
      
      if (response.data.success) {
        console.log(`✅ ${testUser.name} registered successfully!`);
        console.log(`   User ID: ${response.data.user.id}`);
        console.log(`   Email: ${response.data.user.email}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      }
      
    } catch (error) {
      console.log(`❌ ${testUser.name} registration failed:`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data.message}`);
        console.log(`   Error: ${error.response.data.error || 'No additional error info'}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
    console.log('');
  }

  // Test login with registered user
  console.log('🔐 Testing Login...');
  try {
    const loginResponse = await axios.post(`${baseURL}/login`, {
      email: 'superadmin@test.com',
      password: 'admin123456'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful!');
      console.log(`   Welcome: ${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}`);
      console.log(`   Role: ${loginResponse.data.user.role}`);
    }
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
};

// Run the test
testRegistration().catch(console.error);
