const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient'); // CommonJS import
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validatePatient = [
  body('fullName').trim().isLength({ min: 1 }).withMessage('Full name is required'),
  body('phone').trim().isLength({ min: 1 }).withMessage('Phone is required')
];

// ---------------- STATIC ROUTES FIRST ----------------
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments({});
    res.json({ totalPatients });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search/quick', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const patients = await Patient.find({ fullName: { $regex: q, $options: 'i' } }).limit(10);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------- CRUD ROUTES ----------------
router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, validatePatient, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
