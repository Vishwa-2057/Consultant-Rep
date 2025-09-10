const express = require('express');
const Doctor = require('../models/Doctor');
const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .select('fullName email specialty phone')
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
    .select('fullName email specialty phone')
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

module.exports = router;
