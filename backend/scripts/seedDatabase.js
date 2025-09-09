const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Database connection
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Clinic.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    
    console.log('🗑️ Cleared existing data');

    // Create sample clinic
    const clinic = new Clinic({
      name: 'HealthCare Plus Medical Center',
      address: {
        street: '123 Medical Drive',
        city: 'Healthcare City',
        state: 'HC',
        zipCode: '12345',
        country: 'India'
      },
      phone: '+91-9876543210',
      email: 'info@healthcareplus.com',
      website: 'www.healthcareplus.com',
      licenseNumber: 'HC-2024-001',
      services: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'],
      operatingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' }
      }
    });
    
    await clinic.save();
    console.log('🏥 Created sample clinic');

    // Create sample users
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@healthcareplus.com',
        password: 'admin123',
        phone: '+91-9876543210',
        role: 'super_admin',
        clinicId: clinic._id,
        isActive: true,
        isVerified: true
      },
      {
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'dr.smith@healthcareplus.com',
        password: 'doctor123',
        phone: '+91-9876543211',
        role: 'doctor',
        clinicId: clinic._id,
        specialization: 'Cardiology',
        licenseNumber: 'DOC-2024-001',
        isActive: true,
        isVerified: true
      },
      {
        firstName: 'Nurse',
        lastName: 'Johnson',
        email: 'nurse.johnson@healthcareplus.com',
        password: 'nurse123',
        phone: '+91-9876543212',
        role: 'nurse',
        clinicId: clinic._id,
        licenseNumber: 'NUR-2024-001',
        isActive: true,
        isVerified: true
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        password: 'patient123',
        phone: '+91-9876543213',
        role: 'patient',
        clinicId: clinic._id,
        isActive: true,
        isVerified: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created sample users');

    // Create sample patient
    const patientUser = createdUsers.find(user => user.role === 'patient');
    const patient = new Patient({
      userId: patientUser._id,
      clinicId: clinic._id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      bloodType: 'O+',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+91-9876543214'
      },
      medicalHistory: [
        {
          condition: 'Hypertension',
          diagnosedDate: new Date('2020-01-15'),
          status: 'active'
        }
      ],
      allergies: [
        {
          allergen: 'Penicillin',
          severity: 'moderate',
          reaction: 'Skin rash'
        }
      ],
      insuranceInfo: {
        provider: 'Health Insurance Co.',
        policyNumber: 'HIC-123456789',
        groupNumber: 'GRP-001'
      }
    });

    await patient.save();
    console.log('🏥 Created sample patient');

    // Create sample appointment
    const doctor = createdUsers.find(user => user.role === 'doctor');
    const appointment = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      clinicId: clinic._id,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      timeSlot: {
        start: '10:00',
        end: '10:30'
      },
      type: 'consultation',
      status: 'scheduled',
      reason: 'Regular checkup',
      notes: 'Patient reports feeling well'
    });

    await appointment.save();
    console.log('📅 Created sample appointment');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log(`   • 1 Clinic: ${clinic.name}`);
    console.log(`   • ${createdUsers.length} Users (Admin, Doctor, Nurse, Patient)`);
    console.log(`   • 1 Patient Record`);
    console.log(`   • 1 Appointment`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@healthcareplus.com / admin123');
    console.log('   Doctor: dr.smith@healthcareplus.com / doctor123');
    console.log('   Nurse: nurse.johnson@healthcareplus.com / nurse123');
    console.log('   Patient: john.doe@email.com / patient123');
    console.log('\n💡 You can now view this data in MongoDB Compass!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();
