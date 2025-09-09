const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  // Patient Information
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  
  // Specialist Information
  specialistName: {
    type: String,
    required: [true, 'Specialist name is required'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true
  },
  specialistContact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    fax: {
      type: String,
      trim: true
    }
  },
  specialistAddress: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  
  // Referral Details
  referralDate: {
    type: Date,
    required: [true, 'Referral date is required'],
    default: Date.now
  },
  appointmentDate: {
    type: Date
  },
  reason: {
    type: String,
    required: [true, 'Reason for referral is required'],
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },
  urgency: {
    type: String,
    enum: ['Routine', 'Urgent', 'Emergency'],
    default: 'Routine'
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'No Show'],
    default: 'Pending'
  },
  
  // Clinical Information
  diagnosis: {
    type: String,
    trim: true,
    maxlength: [500, 'Diagnosis cannot exceed 500 characters']
  },
  symptoms: {
    type: String,
    trim: true,
    maxlength: [1000, 'Symptoms cannot exceed 1000 characters']
  },
  treatmentHistory: {
    type: String,
    trim: true,
    maxlength: [1000, 'Treatment history cannot exceed 1000 characters']
  },
  medications: [{
    name: {
      type: String,
      trim: true,
      required: true
    },
    dosage: {
      type: String,
      trim: true
    },
    frequency: {
      type: String,
      trim: true
    }
  }],
  
  // Provider Information
  referringProvider: {
    type: String,
    default: 'Dr. Johnson',
    trim: true
  },
  providerNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Provider notes cannot exceed 1000 characters']
  },
  
  // Follow-up Information
  followUpRequired: {
    type: Boolean,
    default: true
  },
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Follow-up notes cannot exceed 500 characters']
  },
  
  // Results and Outcome
  outcome: {
    type: String,
    trim: true,
    maxlength: [1000, 'Outcome cannot exceed 1000 characters']
  },
  recommendations: [{
    type: String,
    trim: true
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for is urgent
referralSchema.virtual('isUrgent').get(function() {
  return this.urgency === 'Urgent' || this.urgency === 'Emergency';
});

// Virtual for is pending
referralSchema.virtual('isPending').get(function() {
  return this.status === 'Pending';
});

// Virtual for full specialist address
referralSchema.virtual('fullSpecialistAddress').get(function() {
  const addr = this.specialistAddress;
  if (!addr.street) return '';
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
});

// Indexes for better query performance
referralSchema.index({ patientId: 1 });
referralSchema.index({ specialty: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ urgency: 1 });
referralSchema.index({ referralDate: -1 });
referralSchema.index({ appointmentDate: 1 });
referralSchema.index({ referringProvider: 1 });
referralSchema.index({ createdAt: -1 });

// Compound index for status and urgency queries
referralSchema.index({ status: 1, urgency: 1 });

// Static method to find referrals by date range
referralSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    referralDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('patientId', 'fullName phone email');
};

// Static method to find pending referrals
referralSchema.statics.findPending = function() {
  return this.find({ status: 'Pending' }).populate('patientId', 'fullName phone email');
};

// Static method to find urgent referrals
referralSchema.statics.findUrgent = function() {
  return this.find({ 
    urgency: { $in: ['Urgent', 'Emergency'] },
    status: { $nin: ['Completed', 'Cancelled'] }
  }).populate('patientId', 'fullName phone email');
};

// Static method to find referrals by specialty
referralSchema.statics.findBySpecialty = function(specialty) {
  return this.find({ specialty }).populate('patientId', 'fullName phone email');
};

// Static method to find referrals by status
referralSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('patientId', 'fullName phone email');
};

// Instance method to schedule appointment
referralSchema.methods.schedule = function(appointmentDate) {
  this.status = 'Scheduled';
  this.appointmentDate = appointmentDate;
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to complete referral
referralSchema.methods.complete = function(outcome, recommendations) {
  this.status = 'Completed';
  if (outcome) this.outcome = outcome;
  if (recommendations) this.recommendations = recommendations;
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to cancel referral
referralSchema.methods.cancel = function() {
  this.status = 'Cancelled';
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to mark as no show
referralSchema.methods.markNoShow = function() {
  this.status = 'No Show';
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to add medication
referralSchema.methods.addMedication = function(medication) {
  this.medications.push(medication);
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to add recommendation
referralSchema.methods.addRecommendation = function(recommendation) {
  this.recommendations.push(recommendation);
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Referral', referralSchema);
