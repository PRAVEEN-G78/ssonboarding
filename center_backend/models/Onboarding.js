const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  type: String,
  filePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const onboardingSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dobAsPerCertificate: { type: Date, required: true },
  dobAsPerCelebration: { type: Date, required: true },
  gender: String,
  nationality: String,
  maritalStatus: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  highestQualification: { type: String, required: true },
  
  // Spouse Information (if married)
  spouseName: String,
  spouseDateOfBirth: Date,
  spouseEmail: String,
  
  // Contact Details
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  
  // Employment Details
  experienceTotalYears: { type: Number, required: true },
  currentSalary: { type: Number, required: true },
  pfUanNumber: { type: String, required: true },
  esiNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  namesAsOnAadhar: { type: String, required: true },
  
  // Banking Information
  panNumber: { type: String, required: true },
  namesAsOnPan: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  namesAsPerBankDetails: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  ifscCode: { type: String, required: true },
  
  // Documents
  documents: [documentSchema],
  
  // Metadata
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
onboardingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Onboarding', onboardingSchema); 