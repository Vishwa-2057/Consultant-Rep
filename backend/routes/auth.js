const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Nurse = require('../models/Nurse');
const Clinic = require('../models/Clinic');
const OTP = require('../models/OTP');
const emailService = require('../services/emailService');

const router = express.Router();

const registerValidation = [
  body('fullName').trim().isLength({ min: 1 }).withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('specialty').optional().isString(),
  body('phone').optional().isString(),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
];

const otpLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

const requestOTPValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { fullName, email, password, specialty, phone } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({ fullName, email, passwordHash, specialty, phone });

    // No need to create individual email configurations
    // The system will use centralized email service for all OTP emails
    console.log(`✅ Doctor ${fullName} registered successfully - OTP emails will be sent from centralized service`);

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specialty: doctor.specialty,
        role: doctor.role,
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password } = req.body;
    
    // Try to find user in Doctor collection first
    let user = await Doctor.findOne({ email });
    let userType = 'doctor';
    
    // If not found in Doctor, try Nurse collection
    if (!user) {
      user = await Nurse.findOne({ email });
      userType = 'nurse';
    }
    
    // If not found in Nurse, try Clinic collection
    if (!user) {
      user = await Clinic.findOne({ 
        $or: [
          { email: email },
          { adminEmail: email },
          { adminUsername: email }
        ]
      });
      userType = 'clinic';
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role || userType }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        name: user.name,
        email: user.email,
        specialty: user.specialty || user.department,
        role: user.role || userType,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/request-otp - Request OTP for login
router.post('/request-otp', requestOTPValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email } = req.body;

    // Check if user exists (doctor, nurse, or clinic)
    let user = await Doctor.findOne({ email });
    if (!user) {
      user = await Nurse.findOne({ email });
    }
    if (!user) {
      user = await Clinic.findOne({ email });
    }
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'No account found with this email address' 
      });
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({
      email,
      purpose: 'login',
      status: 'pending',
      createdAt: { $gte: new Date(Date.now() - 60000) } // 1 minute ago
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        error: 'Please wait before requesting another OTP. Try again in a minute.'
      });
    }

    // Create OTP
    const otp = await OTP.createOTP(
      email,
      'login',
      user._id,
      req.ip,
      req.get('User-Agent')
    );

    // Send email using user's email configuration
    const emailResult = await emailService.sendOTPEmail(user._id, email, otp.code, 'login');

    if (!emailResult.success) {
      // If email fails, delete the OTP
      await OTP.findByIdAndDelete(otp._id);
      return res.status(500).json({
        success: false,
        error: 'Failed to send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your email address',
      data: {
        email: otp.email,
        expiresAt: otp.expiresAt,
        timeRemaining: otp.timeRemaining
      }
    });
  } catch (err) {
    console.error('Request OTP error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// POST /api/auth/login-otp - Login with OTP
router.post('/login-otp', otpLoginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, otp } = req.body;

    // Verify OTP
    const verificationResult = await OTP.verifyOTP(email, otp, 'login');

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        error: verificationResult.message
      });
    }

    const { otp: otpRecord } = verificationResult;

    // Get user information (doctor, nurse, or clinic)
    let user = await Doctor.findById(otpRecord.userId);
    if (!user) {
      user = await Nurse.findById(otpRecord.userId);
    }
    if (!user) {
      user = await Clinic.findById(otpRecord.userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found'
      });
    }

    // Mark OTP as used
    await otpRecord.markAsUsed();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role || (user.specialty ? 'doctor' : user.isClinic ? 'clinic' : 'nurse') }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        specialty: user.specialty || user.department || user.organization,
        role: user.role || (user.specialty ? 'doctor' : user.isClinic ? 'clinic' : 'nurse'),
      }
    });
  } catch (err) {
    console.error('OTP login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find user in Doctor collection first
    let user = await Doctor.findById(payload.id).select('-passwordHash');
    
    // If not found in Doctor, try Nurse collection
    if (!user) {
      user = await Nurse.findById(payload.id).select('-passwordHash');
    }
    
    // If not found in Nurse, try Clinic collection
    if (!user) {
      user = await Clinic.findById(payload.id).select('-passwordHash');
    }
    
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;


