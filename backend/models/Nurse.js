const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nurseSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  department: {
    type: String,
    default: 'General Nursing',
    trim: true
  },
  shift: {
    type: String,
    enum: ['Day', 'Night', 'Evening', 'Rotating'],
    default: 'Day'
  },
  phone: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0,
    default: 0
  },
  role: {
    type: String,
    enum: ['nurse', 'head_nurse', 'supervisor'],
    default: 'nurse'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

nurseSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('Nurse', nurseSchema);
