const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Nurse = require('../models/Nurse');
const router = express.Router();

// GET /api/nurses - Get all nurses
router.get('/', async (req, res) => {
  try {
    const nurses = await Nurse.find({ isActive: true })
      .select('fullName email department shift phone licenseNumber experience role createdAt')
      .sort({ fullName: 1 });
    
    res.json({
      success: true,
      data: nurses
    });
  } catch (error) {
    console.error('Error fetching nurses:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// GET /api/nurses/search - Search nurses by name or department
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const nurses = await Nurse.find({
      isActive: true,
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } }
      ]
    })
    .select('fullName email department shift phone licenseNumber experience role createdAt')
    .sort({ fullName: 1 })
    .limit(20);
    
    res.json({
      success: true,
      data: nurses
    });
  } catch (error) {
    console.error('Error searching nurses:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Validation middleware for creating nurses
const validateNurse = [
  body('fullName').trim().isLength({ min: 1, max: 100 }).withMessage('Full name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),
  body('shift').optional().isIn(['Day', 'Night', 'Evening', 'Rotating']).withMessage('Shift must be Day, Night, Evening, or Rotating'),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10-15 characters'),
  body('licenseNumber').optional().trim().isLength({ max: 50 }).withMessage('License number cannot exceed 50 characters'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('role').optional().isIn(['nurse', 'head_nurse', 'supervisor']).withMessage('Role must be nurse, head_nurse, or supervisor')
];

// POST /api/nurses - Create new nurse
router.post('/', validateNurse, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: errors.array()
      });
    }

    const { fullName, email, password, department, shift, phone, licenseNumber, experience, role } = req.body;

    // Check if nurse with email already exists
    const existingNurse = await Nurse.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({
        success: false,
        message: 'Nurse with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new nurse
    const nurse = new Nurse({
      fullName,
      email,
      passwordHash,
      department: department || 'General Nursing',
      shift: shift || 'Day',
      phone,
      licenseNumber,
      experience: experience || 0,
      role: role || 'nurse'
    });

    await nurse.save();

    // Return nurse without password hash
    const nurseResponse = {
      _id: nurse._id,
      fullName: nurse.fullName,
      email: nurse.email,
      department: nurse.department,
      shift: nurse.shift,
      phone: nurse.phone,
      licenseNumber: nurse.licenseNumber,
      experience: nurse.experience,
      role: nurse.role,
      isActive: nurse.isActive,
      createdAt: nurse.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Nurse created successfully',
      data: nurseResponse
    });
  } catch (error) {
    console.error('Error creating nurse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create nurse',
      error: error.message
    });
  }
});

// GET /api/nurses/:id - Get single nurse
router.get('/:id', async (req, res) => {
  try {
    const nurse = await Nurse.findById(req.params.id)
      .select('fullName email department shift phone licenseNumber experience role isActive createdAt');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse not found'
      });
    }

    res.json({
      success: true,
      data: nurse
    });
  } catch (error) {
    console.error('Error fetching nurse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nurse',
      error: error.message
    });
  }
});

// PUT /api/nurses/:id - Update nurse
router.put('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['fullName', 'department', 'shift', 'phone', 'licenseNumber', 'experience', 'role', 'isActive'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    updates.updatedAt = new Date();

    const nurse = await Nurse.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('fullName email department shift phone licenseNumber experience role isActive createdAt updatedAt');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse not found'
      });
    }

    res.json({
      success: true,
      message: 'Nurse updated successfully',
      data: nurse
    });
  } catch (error) {
    console.error('Error updating nurse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update nurse',
      error: error.message
    });
  }
});

// DELETE /api/nurses/:id - Soft delete nurse
router.delete('/:id', async (req, res) => {
  try {
    const nurse = await Nurse.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).select('fullName email department shift phone licenseNumber experience role isActive');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse not found'
      });
    }

    res.json({
      success: true,
      message: 'Nurse deactivated successfully',
      data: nurse
    });
  } catch (error) {
    console.error('Error deactivating nurse:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate nurse',
      error: error.message
    });
  }
});

module.exports = router;
