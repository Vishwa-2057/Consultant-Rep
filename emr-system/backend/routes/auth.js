const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Register user (with OTP verification)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, clinicId, specialization, licenseNumber } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: firstName, lastName, email, password, phone, role' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      clinicId: role !== 'super_master_admin' ? clinicId : undefined,
      specialization,
      licenseNumber
    });

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Create patient record if role is patient
    if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        clinicId,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        emergencyContact: req.body.emergencyContact
      });
    }

    // Send OTP via email (in production, use actual email service)
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email with the OTP sent.',
      userId: user._id,
      otp: otp // For development only - remove in production
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Quick register (no OTP verification - for development/testing)
router.post('/quick-register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, clinicId, specialization, licenseNumber } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: firstName, lastName, email, password, phone, role' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user (already verified)
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      clinicId: role !== 'super_master_admin' ? clinicId : undefined,
      specialization,
      licenseNumber,
      isVerified: true // Skip OTP verification
    });

    await user.save();

    // Create patient record if role is patient
    if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        clinicId,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        emergencyContact: req.body.emergencyContact
      });
    }

    // Generate token immediately
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered and logged in successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        specialization: user.specialization
      }
    });
  } catch (error) {
    console.error('Quick registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OTP verification failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('clinicId');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email first' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        specialization: user.specialization
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        clinicId: req.user.clinicId,
        specialization: req.user.specialization
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user data', error: error.message });
  }
});

module.exports = router;