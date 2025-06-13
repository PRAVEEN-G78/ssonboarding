const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dobAsPerCertificate: { type: Date, required: true },
  dobAsPerCelebration: { type: Date, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  fatherName: { type: String, required: true },
  fatherAge: { type: Number },
  motherName: { type: String, required: true },
  motherAge: { type: Number },
  highestQualification: { type: String, required: true },
  spouseName: { type: String },
  spouseDateOfBirth: { type: Date },
  weddingDate: { type: Date },
  spouseEmail: { type: String },

  // Contact Details
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  emergencyContact: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true }
  }],

  // Employment Details
  experienceTotalYears: { type: Number, required: true },
  currentSalary: { type: Number, required: true },
  pfUanNumber: { type: String, required: true },
  esiNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  namesAsOnAadhar: { type: String, required: true },
  panNumber: { type: String, required: true },
  namesAsOnPan: { type: String, required: true },

  // Banking Information
  bankAccountNumber: { type: String, required: true },
  namesAsPerBankDetails: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  ifscCode: { type: String, required: true },

  // Documents
  documents: [{
    type: { type: String, required: true },
    fileName: { type: String },
    filePath: { type: String },
    uploadDate: { type: Date, default: Date.now }
  }],

  // Metadata
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
employeeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Employee', employeeSchema); 