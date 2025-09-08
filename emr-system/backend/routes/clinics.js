const express = require('express');
const Clinic = require('../models/Clinic');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all clinics
router.get('/', auth, authorize('super_master_admin'), async (req, res) => {
  try {
    const clinics = await Clinic.find()
      .populate('superAdminId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, clinics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch clinics', error: error.message });
  }
});

// Get clinic by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id)
      .populate('superAdminId', 'firstName lastName email phone');

    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    res.json({ success: true, clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch clinic', error: error.message });
  }
});

// Create new clinic
router.post('/', auth, authorize('super_master_admin'), async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();

    // If superAdminId is provided, update the user's clinic
    if (req.body.superAdminId) {
      await User.findByIdAndUpdate(req.body.superAdminId, { clinicId: clinic._id });
    }

    const populatedClinic = await Clinic.findById(clinic._id)
      .populate('superAdminId', 'firstName lastName email');

    res.status(201).json({ 
      success: true, 
      message: 'Clinic created successfully', 
      clinic: populatedClinic 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create clinic', error: error.message });
  }
});

// Update clinic
router.put('/:id', auth, authorize('super_master_admin', 'super_admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    // Check permissions for super_admin
    if (req.user.role === 'super_admin' && clinic._id.toString() !== req.user.clinicId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updatedClinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('superAdminId', 'firstName lastName email');

    res.json({ success: true, message: 'Clinic updated successfully', clinic: updatedClinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update clinic', error: error.message });
  }
});

// Delete clinic
router.delete('/:id', auth, authorize('super_master_admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    await Clinic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete clinic', error: error.message });
  }
});

module.exports = router;