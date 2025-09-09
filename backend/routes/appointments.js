const express = require('express');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get appointments
router.get('/', auth, async (req, res) => {
  try {
    const { date, doctorId, patientId, status } = req.query;
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      filter.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      filter.doctorId = req.user._id;
    } else if (req.user.role !== 'super_master_admin') {
      filter.clinicId = req.user.clinicId;
    }

    // Additional filters
    if (date) filter.appointmentDate = { $gte: new Date(date), $lt: new Date(date + 'T23:59:59') };
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'patientId userId')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('clinicId', 'name')
      .sort({ appointmentDate: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
});

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      clinicId: req.user.clinicId
    });

    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'patientId userId')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('clinicId', 'name');

    res.status(201).json({ 
      success: true, 
      message: 'Appointment created successfully', 
      appointment: populatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create appointment', error: error.message });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId', 'patientId userId')
     .populate('doctorId', 'firstName lastName specialization')
     .populate('clinicId', 'name');

    res.json({ 
      success: true, 
      message: 'Appointment updated successfully', 
      appointment: updatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update appointment', error: error.message });
  }
});

module.exports = router;