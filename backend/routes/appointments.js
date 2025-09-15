const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Validation middleware
const validateAppointment = [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentType').isIn(['General Consultation', 'Follow-up Visit', 'Annual Checkup', 'Specialist Consultation', 'Emergency Visit', 'Lab Work', 'Imaging', 'Vaccination', 'Physical Therapy', 'Mental Health']).withMessage('Valid appointment type is required'),
  body('date').isISO8601().withMessage('Valid appointment date is required'),
  body('time').trim().isLength({ min: 1 }).withMessage('Appointment time is required'),
  body('duration').optional().isInt({ min: 15, max: 240 }).withMessage('Duration must be between 15 and 240 minutes'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Valid priority level is required')
];

// GET /api/appointments - Get all appointments with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
      date = '',
      patientId = '',
      provider = '',
      sortBy = 'date',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (provider) {
      query.provider = { $regex: provider, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let appointments;
    let total;

    // Role-based filtering: doctors only see appointments for patients assigned to them
    if (req.user.role === 'doctor') {
      // Use aggregation to filter appointments based on patient's assignedDoctors array
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': new mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patientId',
            pipeline: [
              { $project: { fullName: 1, phone: 1, email: 1 } }
            ]
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctorId',
            pipeline: [
              { $project: { fullName: 1, specialty: 1, phone: 1 } }
            ]
          }
        },
        {
          $unwind: { path: '$patientId', preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: '$doctorId', preserveNullAndEmptyArrays: true }
        },
        {
          $project: { patient: 0, __v: 0 }
        },
        { $sort: sort },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
      ];

      appointments = await Appointment.aggregate(pipeline);

      // Get total count for pagination
      const countPipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': new mongoose.Types.ObjectId(req.user.id)
          }
        },
        { $count: 'total' }
      ];

      const countResult = await Appointment.aggregate(countPipeline);
      total = countResult.length > 0 ? countResult[0].total : 0;
    } else {
      // Super admin sees all appointments
      appointments = await Appointment.find(query)
        .populate('patientId', 'fullName phone email')
        .populate('doctorId', 'fullName specialty phone')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      total = await Appointment.countDocuments(query);
    }

    res.json({
      appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName phone email address')
      .select('-__v');
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/appointments - Create new appointment
router.post('/', validateAppointment, async (req, res) => {
  try {
    console.log('Creating appointment with data:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Find the patient by ID
    const patient = await Patient.findById(req.body.patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check for scheduling conflicts
    const appointmentDate = new Date(req.body.date);
    const appointmentTime = req.body.time;
    
    const conflictingAppointment = await Appointment.findOne({
      date: appointmentDate,
      time: appointmentTime,
      provider: req.body.provider || 'Dr. Johnson',
      status: { $in: ['Scheduled', 'Confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ 
        error: 'Time slot is already booked for this provider' 
      });
    }

    // Create new appointment with patient ID and name
    const appointmentData = {
      ...req.body,
      patientId: patient._id,
      patientName: patient.fullName
    };
    
    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Update patient's last visit and next appointment
    await Patient.findByIdAndUpdate(patient._id, {
      lastVisit: new Date(),
      nextAppointment: appointmentDate
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName phone email');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', validateAppointment, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check for scheduling conflicts if date/time is being changed
    if (req.body.date || req.body.time || req.body.provider) {
      const appointmentDate = req.body.date || appointment.date;
      const appointmentTime = req.body.time || appointment.time;
      const provider = req.body.provider || appointment.provider;
      
      const conflictingAppointment = await Appointment.findOne({
        date: appointmentDate,
        time: appointmentTime,
        provider: provider,
        status: { $in: ['Scheduled', 'Confirmed'] },
        _id: { $ne: req.params.id }
      });

      if (conflictingAppointment) {
        return res.status(400).json({ 
          error: 'Time slot is already booked for this provider' 
        });
      }
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate('patientId', 'fullName phone email')
    .select('-__v');

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update status using instance method
    await appointment[status.toLowerCase().replace(' ', '')]();

    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName phone email');

    res.json({
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/today - Get today's appointments
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const query = {
      date: { $gte: startOfDay, $lt: endOfDay }
    };

    let appointments;

    // Role-based filtering: doctors only see appointments for patients assigned to them
    if (req.user.role === 'doctor') {
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': new mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patientId',
            pipeline: [
              { $project: { fullName: 1, phone: 1, email: 1 } }
            ]
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctorId',
            pipeline: [
              { $project: { fullName: 1, specialty: 1, phone: 1 } }
            ]
          }
        },
        {
          $unwind: { path: '$patientId', preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: '$doctorId', preserveNullAndEmptyArrays: true }
        },
        {
          $project: { patient: 0, __v: 0 }
        },
        { $sort: { time: 1 } }
      ];

      appointments = await Appointment.aggregate(pipeline);
    } else {
      appointments = await Appointment.find(query)
        .populate('patientId', 'fullName phone email')
        .populate('doctorId', 'fullName specialty phone')
        .sort({ time: 1 })
        .select('-__v');
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/upcoming - Get upcoming appointments
router.get('/upcoming', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const query = {
      date: { $gte: new Date() },
      status: { $in: ['Scheduled', 'Confirmed'] }
    };

    let appointments;

    // Role-based filtering: doctors only see appointments for patients assigned to them
    if (req.user.role === 'doctor') {
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': new mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patientId',
            pipeline: [
              { $project: { fullName: 1, phone: 1, email: 1 } }
            ]
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctorId',
            pipeline: [
              { $project: { fullName: 1, specialty: 1, phone: 1 } }
            ]
          }
        },
        {
          $unwind: { path: '$patientId', preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: '$doctorId', preserveNullAndEmptyArrays: true }
        },
        {
          $project: { patient: 0, __v: 0 }
        },
        { $sort: { date: 1, time: 1 } },
        { $limit: parseInt(limit) }
      ];

      appointments = await Appointment.aggregate(pipeline);
    } else {
      appointments = await Appointment.find(query)
        .populate('patientId', 'fullName phone email')
        .populate('doctorId', 'fullName specialty phone')
        .sort({ date: 1, time: 1 })
        .limit(parseInt(limit))
        .select('-__v');
    }
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/stats/summary - Get appointment statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    let totalAppointments, todayAppointments, upcomingAppointments, statusStats, typeStats;

    if (req.user.role === 'doctor') {
      // For doctors, use aggregation to filter by patient's assignedDoctors array
      const doctorObjectId = new mongoose.Types.ObjectId(req.user.id);
      
      // Total appointments for assigned patients
      const totalPipeline = [
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': doctorObjectId
          }
        },
        { $count: 'total' }
      ];
      
      const totalResult = await Appointment.aggregate(totalPipeline);
      totalAppointments = totalResult.length > 0 ? totalResult[0].total : 0;

      // Today's appointments for assigned patients
      const todayPipeline = [
        {
          $match: {
            date: { $gte: startOfDay, $lt: endOfDay }
          }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': doctorObjectId
          }
        },
        { $count: 'total' }
      ];
      
      const todayResult = await Appointment.aggregate(todayPipeline);
      todayAppointments = todayResult.length > 0 ? todayResult[0].total : 0;

      // Upcoming appointments for assigned patients
      const upcomingPipeline = [
        {
          $match: {
            date: { $gte: new Date() },
            status: { $in: ['Scheduled', 'Confirmed'] }
          }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': doctorObjectId
          }
        },
        { $count: 'total' }
      ];
      
      const upcomingResult = await Appointment.aggregate(upcomingPipeline);
      upcomingAppointments = upcomingResult.length > 0 ? upcomingResult[0].total : 0;

      // Status stats for assigned patients
      statusStats = await Appointment.aggregate([
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': doctorObjectId
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Type stats for assigned patients
      typeStats = await Appointment.aggregate([
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $match: {
            'patient.assignedDoctors': doctorObjectId
          }
        },
        {
          $group: {
            _id: '$appointmentType',
            count: { $sum: 1 }
          }
        }
      ]);
    } else {
      // Super admin sees all appointments
      totalAppointments = await Appointment.countDocuments({});
      todayAppointments = await Appointment.countDocuments({
        date: { $gte: startOfDay, $lt: endOfDay }
      });
      upcomingAppointments = await Appointment.countDocuments({
        date: { $gte: new Date() },
        status: { $in: ['Scheduled', 'Confirmed'] }
      });
      
      statusStats = await Appointment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      typeStats = await Appointment.aggregate([
        {
          $group: {
            _id: '$appointmentType',
            count: { $sum: 1 }
          }
        }
      ]);
    }

    res.json({
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      statusStats,
      typeStats
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
