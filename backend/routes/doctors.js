const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .select('fullName email specialty phone role createdAt')
      .sort({ fullName: 1 });
    
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// GET /api/doctors/search - Search doctors by name or specialty
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const doctors = await Doctor.find({
      isActive: true,
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { specialty: { $regex: q, $options: 'i' } }
      ]
    })
    .select('fullName email specialty phone role createdAt')
    .sort({ fullName: 1 })
    .limit(20);
    
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Validation middleware for creating doctors
const validateDoctor = [
  body('fullName').trim().isLength({ min: 1, max: 100 }).withMessage('Full name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('specialty').optional().trim().isLength({ max: 100 }).withMessage('Specialty cannot exceed 100 characters'),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10-15 characters'),
  body('role').optional().isIn(['doctor', 'admin']).withMessage('Role must be either doctor or admin')
];

// POST /api/doctors - Create new doctor
router.post('/', validateDoctor, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: errors.array()
      });
    }

    const { fullName, email, password, specialty, phone, role } = req.body;

    // Check if doctor with email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new doctor
    const doctor = new Doctor({
      fullName,
      email,
      passwordHash,
      specialty: specialty || 'General Practitioner',
      phone,
      role: role || 'doctor'
    });

    await doctor.save();

    // Return doctor without password hash
    const doctorResponse = {
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      specialty: doctor.specialty,
      phone: doctor.phone,
      role: doctor.role,
      isActive: doctor.isActive,
      createdAt: doctor.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctorResponse
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
});

// GET /api/doctors/:id - Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('fullName email specialty phone role isActive createdAt');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
});

// PUT /api/doctors/:id - Update doctor
router.put('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['fullName', 'specialty', 'phone', 'role', 'isActive'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    updates.updatedAt = new Date();

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('fullName email specialty phone role isActive createdAt updatedAt');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
});

// DELETE /api/doctors/:id - Soft delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).select('fullName email specialty phone role isActive');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor deactivated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error deactivating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate doctor',
      error: error.message
    });
  }
});

module.exports = router;
