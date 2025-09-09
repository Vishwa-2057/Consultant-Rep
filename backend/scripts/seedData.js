const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const Consultation = require('../../models/Consultation');
const Invoice = require('../../models/Invoice');
const Referral = require('../../models/Referral');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emr_healthcare_db');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleDoctors = [
  {
    fullName: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    specialty: 'Cardiology',
    phone: '+1-555-0101',
    role: 'doctor',
    isActive: true
  },
  {
    fullName: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    specialty: 'Neurology',
    phone: '+1-555-0102',
    role: 'doctor',
    isActive: true
  },
  {
    fullName: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    specialty: 'Pediatrics',
    phone: '+1-555-0103',
    role: 'doctor',
    isActive: true
  },
  {
    fullName: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    specialty: 'Orthopedics',
    phone: '+1-555-0104',
    role: 'doctor',
    isActive: true
  },
  {
    fullName: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@hospital.com',
    specialty: 'Dermatology',
    phone: '+1-555-0105',
    role: 'doctor',
    isActive: true
  }
];

const samplePatients = [
  {
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-1001',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'Male',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1-555-1002'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001'
    },
    medicalHistory: {
      allergies: ['Penicillin'],
      chronicConditions: ['Hypertension'],
      currentMedications: ['Lisinopril 10mg'],
      surgicalHistory: []
    },
    status: 'Active'
  },
  {
    fullName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-1003',
    dateOfBirth: new Date('1990-07-22'),
    gender: 'Female',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Brother',
      phone: '+1-555-1004'
    },
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET987654321',
      groupNumber: 'GRP002'
    },
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      surgicalHistory: ['Appendectomy (2015)']
    },
    status: 'Active'
  },
  {
    fullName: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    phone: '+1-555-1005',
    dateOfBirth: new Date('1978-12-10'),
    gender: 'Male',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Susan Johnson',
      relationship: 'Wife',
      phone: '+1-555-1006'
    },
    insurance: {
      provider: 'Cigna',
      policyNumber: 'CIG456789123',
      groupNumber: 'GRP003'
    },
    medicalHistory: {
      allergies: ['Shellfish'],
      chronicConditions: ['Diabetes Type 2'],
      currentMedications: ['Metformin 500mg'],
      surgicalHistory: []
    },
    status: 'Active'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Consultation.deleteMany({});
    await Invoice.deleteMany({});
    await Referral.deleteMany({});

    console.log('Cleared existing data');

    // Hash password for doctors
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Add password to doctors
    const doctorsWithPassword = sampleDoctors.map(doctor => ({
      ...doctor,
      passwordHash: hashedPassword
    }));

    // Insert doctors
    const createdDoctors = await Doctor.insertMany(doctorsWithPassword);
    console.log(`Created ${createdDoctors.length} doctors`);

    // Insert patients
    const createdPatients = await Patient.insertMany(samplePatients);
    console.log(`Created ${createdPatients.length} patients`);

    // Create sample appointments
    const sampleAppointments = [];
    const appointmentTypes = ['Consultation', 'Follow-up', 'Check-up', 'Procedure'];
    const statuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed'];
    const priorities = ['Low', 'Medium', 'High'];

    for (let i = 0; i < 20; i++) {
      const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const randomDoctor = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
      
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) - 15); // ±15 days
      
      sampleAppointments.push({
        patientId: randomPatient._id,
        patientName: randomPatient.fullName,
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        date: appointmentDate,
        time: `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
        duration: [30, 45, 60][Math.floor(Math.random() * 3)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        location: 'Room ' + (Math.floor(Math.random() * 10) + 1),
        provider: randomDoctor.fullName,
        notes: `Appointment for ${randomPatient.fullName}`,
        reason: 'Regular checkup and consultation'
      });
    }

    const createdAppointments = await Appointment.insertMany(sampleAppointments);
    console.log(`Created ${createdAppointments.length} appointments`);

    // Create sample consultations
    const sampleConsultations = [];
    const consultationTypes = ['General', 'Specialist', 'Follow-up', 'Emergency'];
    const modes = ['In-person', 'Video', 'Phone'];

    for (let i = 0; i < 15; i++) {
      const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const randomDoctor = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
      
      const consultationDate = new Date();
      consultationDate.setDate(consultationDate.getDate() + Math.floor(Math.random() * 20) - 10);
      
      sampleConsultations.push({
        patientId: randomPatient._id,
        patientName: randomPatient.fullName,
        consultationType: consultationTypes[Math.floor(Math.random() * consultationTypes.length)],
        mode: modes[Math.floor(Math.random() * modes.length)],
        date: consultationDate,
        time: `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
        duration: [30, 45, 60][Math.floor(Math.random() * 3)],
        provider: randomDoctor.fullName,
        reason: 'Patient consultation',
        symptoms: ['Headache', 'Fatigue', 'Chest pain'][Math.floor(Math.random() * 3)],
        status: ['Scheduled', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      });
    }

    const createdConsultations = await Consultation.insertMany(sampleConsultations);
    console.log(`Created ${createdConsultations.length} consultations`);

    // Create sample invoices
    const sampleInvoices = [];
    const paymentMethods = ['Cash', 'Credit Card', 'Insurance', 'Check'];
    const invoiceStatuses = ['Draft', 'Sent', 'Paid', 'Overdue'];

    for (let i = 0; i < 12; i++) {
      const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      
      const invoiceDate = new Date();
      invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 60));
      
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      const items = [
        {
          description: 'Consultation Fee',
          quantity: 1,
          rate: 150 + Math.floor(Math.random() * 100)
        },
        {
          description: 'Lab Tests',
          quantity: 1,
          rate: 75 + Math.floor(Math.random() * 50)
        }
      ];

      sampleInvoices.push({
        patientId: randomPatient._id,
        patientName: randomPatient.fullName,
        invoiceNumber: `INV-${Date.now()}-${i}`,
        invoiceDate,
        dueDate,
        items,
        taxRate: 0.08,
        discountRate: 0,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)],
        notes: 'Payment due within 30 days'
      });
    }

    const createdInvoices = await Invoice.insertMany(sampleInvoices);
    console.log(`Created ${createdInvoices.length} invoices`);

    // Create sample referrals
    const sampleReferrals = [];
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Psychiatry'];
    const urgencies = ['Low', 'Medium', 'High', 'Urgent'];
    const referralStatuses = ['Pending', 'Approved', 'In Progress', 'Completed'];

    for (let i = 0; i < 10; i++) {
      const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const randomDoctor = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];
      
      sampleReferrals.push({
        patientId: randomPatient._id,
        patientName: randomPatient.fullName,
        specialistName: `Dr. ${['Anderson', 'Brown', 'Davis', 'Miller', 'Wilson'][Math.floor(Math.random() * 5)]}`,
        specialty,
        specialistContact: {
          phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          email: `specialist${i}@hospital.com`
        },
        reason: `Referral for ${specialty.toLowerCase()} consultation`,
        urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
        status: referralStatuses[Math.floor(Math.random() * referralStatuses.length)],
        referringProvider: randomDoctor.fullName,
        clinicalHistory: 'Patient requires specialist consultation'
      });
    }

    const createdReferrals = await Referral.insertMany(sampleReferrals);
    console.log(`Created ${createdReferrals.length} referrals`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSample login credentials for doctors:');
    console.log('Email: sarah.johnson@hospital.com');
    console.log('Password: password123');
    console.log('\nAll doctors use the same password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

// Check if this script is being run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase, connectDB };
