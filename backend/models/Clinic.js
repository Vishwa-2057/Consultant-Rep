const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    clinicId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    yearOfEstablishment: { type: Number, required: true },
    address: {
      type: String,
      required: true,
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    ownerName: { type: String, required: true },
    ownerMedicalId: { type: String },
    adminName: { type: String, required: true },
    adminContact: { type: String, required: true },
    adminEmail: { type: String, required: true },
    tradeLicense: { type: String },
    medicalCouncilCert: { type: String },
    taxId: { type: String },
    accreditation: { type: String },
    specialties: [{ type: String }],
    services: [{ type: String }],
    operatingHours: { type: String },
    staffCount: { type: Number },
    beds: { type: Number },
    pharmacyAvailable: { type: Boolean, default: false },
    laboratoryAvailable: { type: Boolean, default: false },
    paymentMethods: [{ type: String }],
    bankInfo: { type: String },
    adminUsername: { type: String, required: true },
    adminPassword: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    superAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clinic", clinicSchema);
