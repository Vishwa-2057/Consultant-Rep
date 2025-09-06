const express = require('express');
const Patient = require('../models/Patient');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get patients
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    
    if (req.user.role !== 'super_master_admin') {
      filter.clinicId = req.user.clinicId;
    }

    const patients = await Patient.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .populate('clinicId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone')
      .populate('clinicId', 'name')
      .populate('medications.prescribedBy', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patient', error: error.message });
  }
});

// Update patient
router.put('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phone')
     .populate('clinicId', 'name');

    res.json({ success: true, message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update patient', error: error.message });
  }
});

module.exports = router;