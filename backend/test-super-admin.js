const axios = require('axios');

// Test super admin registration specifically
const testSuperAdminRegistration = async () => {
  const baseURL = 'http://localhost:5001/api/auth';
  
  console.log('🧪 Testing Super Admin Registration\n');

  // Test super master admin registration
  const superAdminData = {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@healthcareplus.com',
    password: 'superadmin123456',
    phone: '+91-9999999999',
    role: 'super_master_admin'
    // Note: No clinicId or licenseNumber needed for super_master_admin
  };

  try {
    console.log('📝 Testing Super Master Admin Registration...');
    
    // Test quick registration (no OTP)
    const response = await axios.post(`${baseURL}/quick-register`, superAdminData);
    
    if (response.data.success) {
      console.log('✅ Super Master Admin registered successfully!');
      console.log(`   User ID: ${response.data.user.id}`);
      console.log(`   Email: ${response.data.user.email}`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(`   Token: ${response.data.token.substring(0, 30)}...`);
      
      // Test login with the registered super admin
      console.log('\n🔐 Testing Super Admin Login...');
      const loginResponse = await axios.post(`${baseURL}/login`, {
        email: superAdminData.email,
        password: superAdminData.password
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Super Admin login successful!');
        console.log(`   Welcome: ${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}`);
        console.log(`   Role: ${loginResponse.data.user.role}`);
      }
      
    }
    
  } catch (error) {
    console.log('❌ Super Admin registration failed:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
      console.log(`   Error: ${error.response.data.error || 'No additional error info'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }

  // Test super admin (clinic level)
  console.log('\n📝 Testing Super Admin (Clinic Level) Registration...');
  const clinicAdminData = {
    firstName: 'Clinic',
    lastName: 'Admin',
    email: 'clinicadmin@healthcareplus.com',
    password: 'clinicadmin123456',
    phone: '+91-9999999998',
    role: 'super_admin',
    clinicId: '507f1f77bcf86cd799439011' // Sample clinic ID
  };

  try {
    const response = await axios.post(`${baseURL}/quick-register`, clinicAdminData);
    
    if (response.data.success) {
      console.log('✅ Clinic Super Admin registered successfully!');
      console.log(`   User ID: ${response.data.user.id}`);
      console.log(`   Email: ${response.data.user.email}`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(`   Clinic ID: ${response.data.user.clinicId}`);
    }
    
  } catch (error) {
    console.log('❌ Clinic Super Admin registration failed:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
      console.log(`   Error: ${error.response.data.error || 'No additional error info'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
};

// Run the test
testSuperAdminRegistration().catch(console.error);
