const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test clinic creation
async function testClinicAPI() {
  try {
    console.log('Testing Clinic API...');
    
    // First, login as super master admin to get token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'superadmin@healthcare.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Test creating a clinic
    const clinicData = {
      name: "Test Healthcare Clinic",
      type: "General",
      registrationNumber: "REG123456",
      yearOfEstablishment: "2020",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
      phone: "+1-555-0123",
      email: "admin@testhealthcare.com",
      website: "https://testhealthcare.com",
      ownerName: "Dr. John Smith",
      ownerMedicalId: "MED123456",
      adminName: "Jane Admin",
      adminContact: "+1-555-0124",
      adminEmail: "jane@testhealthcare.com",
      tradeLicense: "TL123456",
      medicalCouncilCert: "MC123456",
      taxId: "TAX123456",
      accreditation: "NABH",
      specialties: ["General", "Pediatrics"],
      services: ["Consultation", "Lab Tests"],
      operatingHours: "9 AM - 6 PM",
      staffCount: "25",
      beds: "50",
      pharmacyAvailable: true,
      laboratoryAvailable: true,
      paymentMethods: ["Bank", "UPI", "Insurance"],
      bankInfo: "Bank Account: 1234567890",
      adminUsername: "clinic_admin",
      adminPassword: "clinic123",
      clinicId: "UKGW001"
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/clinics`, clinicData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Clinic created successfully:', createResponse.data);
    
    // Test fetching clinics
    const fetchResponse = await axios.get(`${API_BASE_URL}/clinics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Clinics fetched successfully:', fetchResponse.data);
    
  } catch (error) {
    console.error('❌ Error testing clinic API:', error.response?.data || error.message);
  }
}

testClinicAPI();
