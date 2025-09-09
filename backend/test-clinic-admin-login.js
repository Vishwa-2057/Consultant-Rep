const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data for clinic creation
const testClinicData = {
  // Clinic Identity
  name: "HealthCare Plus Test Clinic",
  type: "Multi-specialty",
  registrationNumber: "REG123456789",
  yearOfEstablishment: "2020",
  
  // Contact & Location
  address: "123 Medical Center Drive",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  zipCode: "400001",
  phone: "+91-9876543210",
  email: "clinic@healthcareplus.com",
  website: "https://www.healthcareplus.com",
  
  // Administration
  adminName: "Dr. Rajesh Kumar",
  adminContact: "+91-9876543211",
  adminEmail: "admin@healthcareplus.com",
  ownerName: "Dr. Priya Sharma",
  adminUsername: "clinic_admin",
  adminPassword: "SecurePass123!",
  
  // Infrastructure
  staffCount: 25,
  beds: 50,
  pharmacyAvailable: true,
  laboratoryAvailable: true
};

// Test super master admin credentials (assuming they exist)
const superAdminCredentials = {
  email: "admin@emr.com",
  password: "password123"
};

async function testClinicAdminLogin() {
  try {
    console.log('🧪 Testing Clinic Admin Login Functionality\n');

    // Step 1: Login as Super Master Admin
    console.log('1️⃣ Logging in as Super Master Admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, superAdminCredentials);
    
    if (!loginResponse.data.success) {
      console.log('❌ Super Master Admin login failed');
      return;
    }
    
    const superAdminToken = loginResponse.data.token;
    console.log('✅ Super Master Admin login successful');

    // Step 2: Create a new clinic (which creates admin user)
    console.log('\n2️⃣ Creating new clinic with admin credentials...');
    const clinicResponse = await axios.post(`${BASE_URL}/clinics`, testClinicData, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });

    if (!clinicResponse.data.success) {
      console.log('❌ Clinic creation failed:', clinicResponse.data.message);
      return;
    }

    console.log('✅ Clinic created successfully');
    console.log('📋 Clinic Details:', {
      id: clinicResponse.data.clinic._id,
      name: clinicResponse.data.clinic.name,
      adminEmail: clinicResponse.data.adminCredentials.email,
      adminRole: clinicResponse.data.adminCredentials.role
    });

    // Step 3: Test clinic admin login
    console.log('\n3️⃣ Testing clinic admin login...');
    const adminLoginData = {
      email: testClinicData.adminEmail,
      password: testClinicData.adminPassword
    };

    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, adminLoginData);

    if (!adminLoginResponse.data.success) {
      console.log('❌ Clinic admin login failed:', adminLoginResponse.data.message);
      return;
    }

    console.log('✅ Clinic admin login successful!');
    console.log('👤 Admin User Details:', {
      id: adminLoginResponse.data.user.id,
      name: `${adminLoginResponse.data.user.firstName} ${adminLoginResponse.data.user.lastName}`,
      email: adminLoginResponse.data.user.email,
      role: adminLoginResponse.data.user.role,
      clinicId: adminLoginResponse.data.user.clinicId
    });

    // Step 4: Test authenticated access with admin token
    console.log('\n4️⃣ Testing authenticated access with admin token...');
    const adminToken = adminLoginResponse.data.token;
    
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (meResponse.data.success) {
      console.log('✅ Authenticated access successful');
      console.log('🔐 Token validation passed for clinic admin');
    }

    // Step 5: Test clinic access with admin credentials
    console.log('\n5️⃣ Testing clinic data access...');
    const clinicsResponse = await axios.get(`${BASE_URL}/clinics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (clinicsResponse.data.success) {
      console.log('✅ Clinic admin can access clinic data');
      console.log('🏥 Accessible clinics:', clinicsResponse.data.clinics.length);
    }

    console.log('\n🎉 All tests passed! Clinic admin login functionality is working correctly.');
    
    return {
      success: true,
      clinicId: clinicResponse.data.clinic._id,
      adminToken: adminToken,
      adminUser: adminLoginResponse.data.user
    };

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testClinicAdminLogin()
    .then(result => {
      if (result.success) {
        console.log('\n✅ Test Summary: Clinic admin login functionality verified successfully');
      } else {
        console.log('\n❌ Test Summary: Clinic admin login functionality needs attention');
      }
    })
    .catch(error => {
      console.error('Test execution error:', error);
    });
}

module.exports = testClinicAdminLogin;
