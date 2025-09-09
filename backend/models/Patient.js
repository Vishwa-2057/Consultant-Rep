const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  maritalStatus: {
    type: Boolean,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true
  },
  attenderEmail: {
    type: String,
    required: true
  },
  attenderMobile: {
    type: String,
    required: true
  },
  attenderWhatsapp: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  pinCode: {
    type: String,
    required: true
  },
  modeOfCare: {
    type: String,
    enum: ['In-person', 'Virtual', 'Hybrid', 'Home Care'],
    required: true
  },
  patientId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: { type: String, enum: ['active', 'resolved', 'chronic'] }
  }],
  allergies: [{
    allergen: String,
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
    reaction: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  }
}, {
  timestamps: true
});

patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.models.Patient.countDocuments();
    this.patientId = `PAT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);