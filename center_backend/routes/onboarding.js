const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Onboarding = require('../models/Onboarding');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Submit onboarding form
router.post('/', async (req, res) => {
  try {
    const onboardingData = new Onboarding(req.body);
    const savedData = await onboardingData.save();
    res.status(201).json({
      message: 'Onboarding form submitted successfully',
      employeeId: savedData._id
    });
  } catch (error) {
    console.error('Error submitting onboarding form:', error);
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
});

// Get onboarding data
router.get('/:employeeId', async (req, res) => {
  try {
    const onboardingData = await Onboarding.findById(req.params.employeeId);
    if (!onboardingData) {
      return res.status(404).json({ message: 'Onboarding data not found' });
    }
    res.json(onboardingData);
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Upload document
router.post('/:employeeId/documents', upload.single('file'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { documentType } = req.body;
    const filePath = req.file.path;

    const onboardingData = await Onboarding.findById(employeeId);
    if (!onboardingData) {
      return res.status(404).json({ message: 'Onboarding data not found' });
    }

    onboardingData.documents.push({
      type: documentType,
      filePath: filePath
    });

    await onboardingData.save();
    res.status(200).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
});

module.exports = router; 