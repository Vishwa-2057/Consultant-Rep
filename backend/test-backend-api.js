const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5001/api';

// Test configuration
const testConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

let authToken = '';
let testDoctorId = '';
let testPatientId = '';
let testAppointmentId = '';

// Test functions
const testHealthCheck = async () => {
  try {
    console.log('\n🔍 Testing Health Check...');
    const response = await axios.get(`${BASE_URL}/health`, testConfig);
    console.log('✅ Health Check:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
    return false;
  }
};

const testDoctorLogin = async () => {
  try {
    console.log('\n🔍 Testing Doctor Login...');
    const loginData = {
      email: 'sarah.johnson@hospital.com',
      password: 'password123'
    };
    
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData, testConfig);
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      testConfig.headers.Authorization = `Bearer ${authToken}`;
      console.log('✅ Doctor Login successful');
      return true;
    } else {
      console.error('❌ Doctor Login failed: No token received');
      return false;
    }
  } catch (error) {
    console.error('❌ Doctor Login failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetDoctors = async () => {
  try {
    console.log('\n🔍 Testing Get Doctors...');
    const response = await axios.get(`${BASE_URL}/doctors?page=1&limit=5`, testConfig);
    
    if (response.data.success && response.data.data.length > 0) {
      testDoctorId = response.data.data[0]._id;
      console.log(`✅ Get Doctors successful - Found ${response.data.data.length} doctors`);
      return true;
    } else {
      console.error('❌ Get Doctors failed: No doctors found');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Doctors failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetPatients = async () => {
  try {
    console.log('\n🔍 Testing Get Patients...');
    const response = await axios.get(`${BASE_URL}/patients?page=1&limit=5`, testConfig);
    
    if (response.data.success && response.data.patients.length > 0) {
      testPatientId = response.data.patients[0]._id;
      console.log(`✅ Get Patients successful - Found ${response.data.patients.length} patients`);
      return true;
    } else {
      console.error('❌ Get Patients failed: No patients found');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Patients failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetAppointments = async () => {
  try {
    console.log('\n🔍 Testing Get Appointments...');
    const response = await axios.get(`${BASE_URL}/appointments?page=1&limit=5`, testConfig);
    
    if (response.data.success) {
      if (response.data.appointments && response.data.appointments.length > 0) {
        testAppointmentId = response.data.appointments[0]._id;
        console.log(`✅ Get Appointments successful - Found ${response.data.appointments.length} appointments`);
      } else {
        console.log('✅ Get Appointments successful - No appointments found (empty database)');
      }
      return true;
    } else {
      console.error('❌ Get Appointments failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Appointments failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetConsultations = async () => {
  try {
    console.log('\n🔍 Testing Get Consultations...');
    const response = await axios.get(`${BASE_URL}/consultations?page=1&limit=5`, testConfig);
    
    if (response.data.success) {
      console.log(`✅ Get Consultations successful - Found ${response.data.data.length} consultations`);
      return true;
    } else {
      console.error('❌ Get Consultations failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Consultations failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetReferrals = async () => {
  try {
    console.log('\n🔍 Testing Get Referrals...');
    const response = await axios.get(`${BASE_URL}/referrals?page=1&limit=5`, testConfig);
    
    if (response.data.success) {
      console.log(`✅ Get Referrals successful - Found ${response.data.data.length} referrals`);
      return true;
    } else {
      console.error('❌ Get Referrals failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Referrals failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetInvoices = async () => {
  try {
    console.log('\n🔍 Testing Get Invoices...');
    const response = await axios.get(`${BASE_URL}/invoices?page=1&limit=5`, testConfig);
    
    if (response.data.success) {
      console.log(`✅ Get Invoices successful - Found ${response.data.data.length} invoices`);
      return true;
    } else {
      console.error('❌ Get Invoices failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Get Invoices failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testDashboardOverview = async () => {
  try {
    console.log('\n🔍 Testing Dashboard Overview...');
    const response = await axios.get(`${BASE_URL}/dashboard/overview`, testConfig);
    
    if (response.data.success && response.data.data) {
      console.log('✅ Dashboard Overview successful');
      console.log(`   - Total Patients: ${response.data.data.patients.total}`);
      console.log(`   - Total Doctors: ${response.data.data.doctors.total}`);
      console.log(`   - Total Appointments: ${response.data.data.appointments.total}`);
      return true;
    } else {
      console.error('❌ Dashboard Overview failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Dashboard Overview failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testDashboardAnalytics = async () => {
  try {
    console.log('\n🔍 Testing Dashboard Analytics...');
    const response = await axios.get(`${BASE_URL}/dashboard/analytics?period=30d`, testConfig);
    
    if (response.data.success && response.data.data) {
      console.log('✅ Dashboard Analytics successful');
      return true;
    } else {
      console.error('❌ Dashboard Analytics failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Dashboard Analytics failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testSystemHealth = async () => {
  try {
    console.log('\n🔍 Testing System Health...');
    const response = await axios.get(`${BASE_URL}/dashboard/system-health`, testConfig);
    
    if (response.data.success && response.data.data) {
      console.log('✅ System Health successful');
      console.log(`   - Database Status: ${response.data.data.database.status}`);
      console.log(`   - Total Records: ${response.data.data.database.totalRecords}`);
      return true;
    } else {
      console.error('❌ System Health failed');
      return false;
    }
  } catch (error) {
    console.error('❌ System Health failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testCreateAppointment = async () => {
  if (!testPatientId) {
    console.log('\n⚠️  Skipping Create Appointment test - No patient ID available');
    return true;
  }

  try {
    console.log('\n🔍 Testing Create Appointment...');
    const appointmentData = {
      patientId: testPatientId,
      patientName: 'Test Patient',
      type: 'Consultation',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time: '10:00',
      duration: 30,
      provider: 'Dr. Test Provider',
      reason: 'API Test Appointment',
      priority: 'Medium'
    };
    
    const response = await axios.post(`${BASE_URL}/appointments`, appointmentData, testConfig);
    
    if (response.data.success) {
      console.log('✅ Create Appointment successful');
      return true;
    } else {
      console.error('❌ Create Appointment failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Create Appointment failed:', error.response?.data?.message || error.message);
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting EMR Backend API Tests...');
  console.log('='.repeat(50));

  const tests = [
    testHealthCheck,
    testDoctorLogin,
    testGetDoctors,
    testGetPatients,
    testGetAppointments,
    testGetConsultations,
    testGetReferrals,
    testGetInvoices,
    testDashboardOverview,
    testDashboardAnalytics,
    testSystemHealth,
    testCreateAppointment
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Test failed with error:`, error.message);
      failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the backend server and database connection.');
  }
};

// Check if server is running before starting tests
const checkServerConnection = async () => {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.error('❌ Cannot connect to backend server at', BASE_URL);
    console.error('Please make sure the server is running with: npm run dev');
    return false;
  }
};

// Run tests
const main = async () => {
  const serverRunning = await checkServerConnection();
  if (serverRunning) {
    await runAllTests();
  }
  process.exit(0);
};

main();
