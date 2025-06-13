import React, { useState } from 'react';
import './Onboarding.css';
import { onboardingService } from '../../services/onboardingService';

const steps = [
  'Personal Information',
  'Contact Details',
  'Employment Details',
  'Banking Information',
  'Documents Upload',
];

const initialFormData = {
  firstName: '',
  lastName: '',
  dobAsPerCertificate: '',
  dobAsPerCelebration: '',
  gender: '',
  nationality: '',
  maritalStatus: '',
  bloodGroup: '',
  fatherName: '',
  fatherAge: '',
  motherName: '',
  motherAge: '',
  highestQualification: '',
  spouseName: '',
  spouseDateOfBirth: '',
  weddingDate: '',
  spouseEmail: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  emergencyContact: [{ name: '', relationship: '', phone: '' }],
  experienceTotalYears: '',
  currentSalary: '',
  pfUanNumber: '',
  esiNumber: '',
  aadharNumber: '',
  namesAsOnAadhar: '',
  panNumber: '',
  namesAsOnPan: '',
  bankAccountNumber: '',
  namesAsPerBankDetails: '',
  bankName: '',
  branchName: '',
  ifscCode: '',
  documents: [
    { type: 'HAR', file: null },
    { type: 'Resume', file: null },
    { type: 'Last Appointment Letter', file: null },
    { type: 'Last Payslip', file: null },
    { type: 'Last 6 months Bank Statement', file: null },
    { type: 'All Experience Letters', file: null },
    { type: 'SSC Certificate', file: null },
    { type: 'Intermediate Certificate', file: null },
    { type: 'Degree Certificate', file: null },
    { type: 'Post Graduate Certificate', file: null },
    { type: 'Any other Certifications/ Diplomas', file: null },
    { type: 'PAN Card - Scan Copy', file: null },
    { type: 'Aadhar Card - Scan Copy', file: null },
    { type: 'BankPass Book - 1stPage Scan Copy', file: null },
    { type: 'Latest Passport Photo - Scan Copy', file: null },
  ],
};

const educationOptions = [
  'High School',
  'Associate\'s Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate',
  'Other'
];

function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    highestQualification: '',
    dobAsPerCertificate: '',
    dobAsPerCelebration: '',
    maritalStatus: '',
    spouseName: '',
    spouseDateOfBirth: '',
    spouseEmail: '',
    bloodGroup: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    experience: '',
    currentSalary: '',
    pfNumber: '',
    uanNumber: '',
    esiNumber: '',
    aadharNumber: '',
    namesAsOnAadhar: '',
    panNumber: '',
    namesAsOnPan: '',
    bankAccountNumber: '',
    namesAsPerBankDetails: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    documents: [
      { type: 'HAR', file: null },
      { type: 'Resume', file: null },
      { type: 'Last Appointment Letter', file: null },
      { type: 'Last Payslip', file: null },
      { type: 'Last 6 months Bank Statement', file: null },
      { type: 'All Experience Letters', file: null },
      { type: 'SSC Certificate', file: null },
      { type: 'Intermediate Certificate', file: null },
      { type: 'Degree Certificate', file: null },
      { type: 'Post Graduate Certificate', file: null },
      { type: 'Any other Certifications/ Diplomas', file: null },
      { type: 'PAN Card - Scan Copy', file: null },
      { type: 'Aadhar Card - Scan Copy', file: null },
      { type: 'BankPass Book - 1stPage Scan Copy', file: null },
      { type: 'Latest Passport Photo - Scan Copy', file: null },
    ]
  });
  const [errors, setErrors] = useState({});
  const [filteredEducationOptions, setFilteredEducationOptions] = useState(educationOptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  const filteredBloodGroups = bloodGroups.filter(group =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBloodGroupSelect = (group) => {
    setFormData(prev => ({ ...prev, bloodGroup: group }));
    setSelectedBloodGroup(group);
    setSearchTerm(group);
    setShowDropdown(false);
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validation for numeric fields
    if (['phone', 'pincode', 'experience', 'currentSalary', 'pfNumber', 'esiNumber', 'aadharNumber', 'bankAccountNumber'].includes(name)) {
      if (!/^\d+$/.test(value)) {
        return; // Only allow numeric input
      }
    }

    // Validation for alphabetic fields
    if (['firstName', 'lastName', 'fatherName', 'motherName', 'city', 'state', 'bankName', 'branchName'].includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return; // Only allow alphabetic input
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSelectChange = (name) => (event) => {
    setFormData(prev => ({
      ...prev,
      [name]: event.target.value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContact];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      emergencyContact: updatedContacts,
    }));
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: [...prev.emergencyContact, { name: '', relationship: '', phone: '' }],
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: prev.emergencyContact.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentUpload = (e, index) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.map((doc, i) =>
          i === index ? { ...doc, file } : doc
        )
      }));
    }
  };

  const handleDocumentRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, file: null } : doc
      )
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.fatherName) newErrors.fatherName = 'Father\'s name is required';
        if (!formData.motherName) newErrors.motherName = 'Mother\'s name is required';
        if (!formData.highestQualification) newErrors.highestQualification = 'Highest qualification is required';
        if (!formData.dobAsPerCertificate) newErrors.dobAsPerCertificate = 'Date of birth (as per certificate) is required';
        if (formData.dobAsPerCertificate) {
          const dob = new Date(formData.dobAsPerCertificate);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (dob > today) newErrors.dobAsPerCertificate = 'Date of birth cannot be in the future';
          if (age < 18) newErrors.dobAsPerCertificate = 'Must be at least 18 years old';
        }
        if (!formData.dobAsPerCelebration) newErrors.dobAsPerCelebration = 'Date of birth (as per celebration) is required';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        if (formData.maritalStatus === 'yes') {
          if (!formData.spouseName) newErrors.spouseName = 'Spouse\'s name is required if married';
          if (!formData.spouseDateOfBirth) newErrors.spouseDateOfBirth = 'Spouse\'s date of birth is required if married';
          if (!formData.spouseEmail) newErrors.spouseEmail = 'Spouse\'s email is required if married';
          if (formData.spouseEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.spouseEmail)) {
            newErrors.spouseEmail = 'Invalid email format';
          }
        }
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        break;
      case 1:
        if (!formData.email) newErrors.email = 'Email is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.phone) newErrors.phone = 'Phone Number is required';
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
          newErrors.phone = 'Phone number must be exactly 10 digits';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode) newErrors.pincode = 'pincode is required';
        break;
      case 2:
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.currentSalary) newErrors.currentSalary = 'Current Salary is required';
        if (!formData.pfNumber) newErrors.pfNumber = 'PF Number is required';
        if (formData.pfNumber && !/^[A-Za-z0-9]{22,}$/.test(formData.pfNumber)) {
          newErrors.pfNumber = 'PF must be at least 22 characters (can include letters and numbers)';
        }
        if (!formData.uanNumber) newErrors.uanNumber = 'UAN Number is required';
        if (formData.uanNumber && !/^[A-Za-z0-9]{12,}$/.test(formData.uanNumber)) {
          newErrors.uanNumber = 'UAN must be at least 12 characters (can include letters and numbers)';
        }
        if (!formData.esiNumber) newErrors.esiNumber = 'ESI Number is required';
        if (formData.esiNumber && !/^\d{10}$/.test(formData.esiNumber)) {
          newErrors.esiNumber = 'ESI number must be exactly 10 digits';
        } 
        if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar Number is required';
        if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
          newErrors.aadharNumber = 'Aadhar number must be exactly 12 digits';
        }
        if (!formData.namesAsOnAadhar) newErrors.namesAsOnAadhar = 'Names as on Aadhar is required';
        if (formData.namesAsOnAadhar && !/^[A-Za-z\s]+$/.test(formData.namesAsOnAadhar)) {
          newErrors.namesAsOnAadhar = 'Names as on Aadhar should contain only letters and spaces';
        }
        break;
      case 3:
        if (!formData.panNumber) newErrors.panNumber = 'PAN # is required';
        if (!formData.namesAsOnPan) newErrors.namesAsOnPan = 'Names as on PAN is required';
        if (!formData.bankAccountNumber) newErrors.bankAccountNumber = 'Bank Account Number is required';
        if (!formData.namesAsPerBankDetails) newErrors.namesAsPerBankDetails = 'Names as per Bank details is required';
        if (!formData.bankName) newErrors.bankName = 'Bank Name is required';
        if (!formData.branchName) newErrors.branchName = 'Branch Name is required';
        if (!formData.ifscCode) newErrors.ifscCode = 'IFSC Code is required';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        
        // Submit the form data
        const response = await onboardingService.submitOnboardingData(formData);
        
        // Handle document uploads
        const documentUploadPromises = formData.documents
          .filter(doc => doc.file)
          .map(doc => 
            onboardingService.uploadDocument(
              response.employeeId,
              doc.type,
              doc.file
            )
          );
        
        await Promise.all(documentUploadPromises);
        
        setSubmitSuccess(true);
        // You might want to redirect or show a success message
        alert('Onboarding form submitted successfully!');
      } catch (error) {
        setSubmitError(error.message || 'Failed to submit form. Please try again.');
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateStep(activeStep);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.fatherName ? 'error' : ''}`}
              />
              {errors.fatherName && <div className="error-message">{errors.fatherName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.motherName ? 'error' : ''}`}
              />
              {errors.motherName && <div className="error-message">{errors.motherName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Education (Highest Qualification)</label>
              <select
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.highestQualification ? 'error' : ''}`}
              >
                <option value="">Select Highest Qualification</option>
                <option value="High School">High School</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Other">Other</option>
              </select>
              {errors.highestQualification && <div className="error-message">{errors.highestQualification}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth (As per Certificate)</label>
              <input
                type="date"
                name="dobAsPerCertificate"
                value={formData.dobAsPerCertificate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.dobAsPerCertificate ? 'error' : ''}`}
              />
              {errors.dobAsPerCertificate && <div className="error-message">{errors.dobAsPerCertificate}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth (As per Celebration)</label>
              <input
                type="date"
                name="dobAsPerCelebration"
                value={formData.dobAsPerCelebration}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.dobAsPerCelebration ? 'error' : ''}`}
              />
              {errors.dobAsPerCelebration && <div className="error-message">{errors.dobAsPerCelebration}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Married (Y/N)</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.maritalStatus ? 'error' : ''}`}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.maritalStatus && <div className="error-message">{errors.maritalStatus}</div>}
            </div>
            {formData.maritalStatus === 'yes' && (
              <>
                <div className="form-group">
                  <label className="form-label">Spouse's Name</label>
                  <input
                    type="text"
                    name="spouseName"
                    value={formData.spouseName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.spouseName ? 'error' : ''}`}
                  />
                  {errors.spouseName && <div className="error-message">{errors.spouseName}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Spouse's Date of Birth</label>
                  <input
                    type="date"
                    name="spouseDateOfBirth"
                    value={formData.spouseDateOfBirth}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.spouseDateOfBirth ? 'error' : ''}`}
                  />
                  {errors.spouseDateOfBirth && <div className="error-message">{errors.spouseDateOfBirth}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Spouse's Mail ID</label>
                  <input
                    type="email"
                    name="spouseEmail"
                    value={formData.spouseEmail}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.spouseEmail ? 'error' : ''}`}
                  />
                  {errors.spouseEmail && <div className="error-message">{errors.spouseEmail}</div>}
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className={`form-input ${errors.bloodGroup ? 'error' : ''}`}
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredBloodGroups.length > 0 ? (
                      filteredBloodGroups.map((group) => (
                        <div
                          key={group}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          onClick={() => handleBloodGroupSelect(group)}
                        >
                          {group}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">No blood groups found</div>
                    )}
                  </div>
                )}
              </div>
              {errors.bloodGroup && <div className="error-message">{errors.bloodGroup}</div>}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.phone ? 'error' : ''}`}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.address ? 'error' : ''}`}
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.city ? 'error' : ''}`}
              />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.state ? 'error' : ''}`}
              />
              {errors.state && <div className="error-message">{errors.state}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.pincode ? 'error' : ''}`}
              />
              {errors.pincode && <div className="error-message">{errors.pincode}</div>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Experience (Total Years)</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.experience ? 'error' : ''}`}
              />
              {errors.experience && <div className="error-message">{errors.experience}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Current Salary</label>
              <input
                type="text"
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.currentSalary ? 'error' : ''}`}
              />
              {errors.currentSalary && <div className="error-message">{errors.currentSalary}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">PF Number </label>
              <input
                type="text"
                name="pfNumber"
                value={formData.pfNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.pfNumber ? 'error' : ''}`}
              />
              {errors.pfNumber && <div className="error-message">{errors.pfNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label"> UAN Number</label>
              <input
                type="text"
                name="uanNumber"
                value={formData.uanNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.uanNumber ? 'error' : ''}`}
              />
              {errors.uanNumber && <div className="error-message">{errors.uanNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">ESI Number</label>
              <input
                type="text"
                name="esiNumber"
                value={formData.esiNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.esiNumber ? 'error' : ''}`}
              />
              {errors.esiNumber && <div className="error-message">{errors.esiNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.aadharNumber ? 'error' : ''}`}
              />
              {errors.aadharNumber && <div className="error-message">{errors.aadharNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Names as on Aadhar</label>
              <input
                type="text"
                name="namesAsOnAadhar"
                value={formData.namesAsOnAadhar}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.namesAsOnAadhar ? 'error' : ''}`}
              />
              {errors.namesAsOnAadhar && <div className="error-message">{errors.namesAsOnAadhar}</div>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">PAN </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.panNumber ? 'error' : ''}`}
              />
              {errors.panNumber && <div className="error-message">{errors.panNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Names as on PAN</label>
              <input
                type="text"
                name="namesAsOnPan"
                value={formData.namesAsOnPan}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.namesAsOnPan ? 'error' : ''}`}
              />
              {errors.namesAsOnPan && <div className="error-message">{errors.namesAsOnPan}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Bank Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.bankAccountNumber ? 'error' : ''}`}
              />
              {errors.bankAccountNumber && <div className="error-message">{errors.bankAccountNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Names as per Bank details</label>
              <input
                type="text"
                name="namesAsPerBankDetails"
                value={formData.namesAsPerBankDetails}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.namesAsPerBankDetails ? 'error' : ''}`}
              />
              {errors.namesAsPerBankDetails && <div className="error-message">{errors.namesAsPerBankDetails}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.bankName ? 'error' : ''}`}
              />
              {errors.bankName && <div className="error-message">{errors.bankName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.branchName ? 'error' : ''}`}
              />
              {errors.branchName && <div className="error-message">{errors.branchName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.ifscCode ? 'error' : ''}`}
              />
              {errors.ifscCode && <div className="error-message">{errors.ifscCode}</div>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="document-upload-section">
            <h3>Documents Upload</h3>
            <div className="document-list">
              {formData.documents.map((doc, index) => (
                <div key={index} className="document-item">
                  <label className="document-label">{doc.type}</label>
                  <div className="document-controls">
                    <input
                      type="file"
                      onChange={(e) => handleDocumentUpload(e, index)}
                      className="file-input"
                      id={`document-upload-${index}`}
                      accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                    />
                    <label htmlFor={`document-upload-${index}`} className="button button-outlined">
                      {doc.file ? 'Change File' : 'Choose File'}
                    </label>
                    {doc.file && (
                      <span className="file-name">{doc.file.name}</span>
                    )}
                    {doc.file && (
                      <button
                        type="button"
                        onClick={() => handleDocumentRemove(index)}
                        className="button button-secondary button-remove"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-paper">
        <h1 className="onboarding-title">Employee Onboarding</h1>
        {submitError && (
          <div className="error-message global-error">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="success-message">
            Form submitted successfully!
          </div>
        )}
        <div className="stepper">
          {steps.map((label, index) => (
            <div key={label} className={`step ${index === activeStep ? 'active' : ''}`}>
              <div className="step-label">{label}</div>
            </div>
          ))}
        </div>
        {activeStep === steps.length - 1 ? (
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            <div className="button-group">
              <button
                type="button"
                className="button button-secondary"
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="button button-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        ) : (
          <>
            {renderStepContent(activeStep)}
            <div className="button-group">
              <button
                type="button"
                className="button button-secondary"
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Onboarding; 