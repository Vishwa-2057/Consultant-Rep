const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, authorize('super_master_admin', 'super_admin'), async (req, res) => {
  try {
    const { role, clinicId } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (req.user.role === 'super_admin' && req.user.clinicId) {
      filter.clinicId = req.user.clinicId;
    } else if (clinicId) {
      filter.clinicId = clinicId;
    }

    const users = await User.find(filter)
      .populate('clinicId', 'name')
      .select('-password -otp -otpExpires')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('clinicId', 'name')
      .select('-password -otp -otpExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, specialization, licenseNumber, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'super_admin' && user.clinicId.toString() !== req.user.clinicId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, specialization, licenseNumber, isActive },
      { new: true, runValidators: true }
    ).populate('clinicId', 'name').select('-password -otp -otpExpires');

    res.json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
});

// Delete user
router.delete('/:id', auth, authorize('super_master_admin', 'super_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'super_admin' && user.clinicId.toString() !== req.user.clinicId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;