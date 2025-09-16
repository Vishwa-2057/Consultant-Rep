const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Invoice = require('../models/Invoice');
const Referral = require('../models/Referral');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview statistics
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    // Get basic counts
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments({ isActive: true });
    const totalAppointments = await Appointment.countDocuments();
    const totalConsultations = 0; // await Consultation.countDocuments();

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: today, $lt: tomorrow }
    });

    // Get pending appointments
    const pendingAppointments = await Appointment.countDocuments({
      status: 'Scheduled'
    });

    // Get revenue statistics - temporarily return mock data
    const revenueStats = [{ _id: null, totalRevenue: 0, count: 0 }];

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
    const paidInvoices = revenueStats.length > 0 ? revenueStats[0].count : 0;

    // Get outstanding invoices - temporarily return mock data
    const outstandingInvoices = 0; // await Invoice.countDocuments({
      // status: { $nin: ['Paid', 'Cancelled'] }
    // });

    // Get urgent referrals - temporarily return mock data
    const urgentReferrals = 0; // await Referral.countDocuments({
      // urgency: { $in: ['High', 'Urgent'] },
      // status: { $nin: ['Completed', 'Cancelled'] }
    // });

    res.json({
      success: true,
      data: {
        patients: {
          total: totalPatients,
          new: 0 // This would need additional logic for "new" patients
        },
        doctors: {
          total: totalDoctors,
          active: totalDoctors
        },
        appointments: {
          total: totalAppointments,
          today: todayAppointments,
          pending: pendingAppointments
        },
        consultations: {
          total: totalConsultations
        },
        revenue: {
          total: totalRevenue,
          paidInvoices,
          outstandingInvoices
        },
        referrals: {
          urgent: urgentReferrals
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard overview',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity for dashboard
// @access  Private
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patientId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent consultations
    const recentConsultations = await Consultation.find()
      .populate('patientId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent invoices
    const recentInvoices = await Invoice.find()
      .populate('patientId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent referrals
    const recentReferrals = await Referral.find()
      .populate('patientId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: {
        appointments: recentAppointments,
        consultations: recentConsultations,
        invoices: recentInvoices,
        referrals: recentReferrals
      }
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent activity',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data for charts
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Appointments trend
    const appointmentsTrend = await Appointment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Revenue trend
    const revenueTrend = await Invoice.aggregate([
      { 
        $match: { 
          status: 'Paid',
          paymentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' },
            day: { $dayOfMonth: '$paymentDate' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Patient registrations trend
    const patientsTrend = await Patient.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Appointment status distribution
    const appointmentStatusDistribution = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Consultation type distribution
    const consultationTypeDistribution = await Consultation.aggregate([
      { $group: { _id: '$consultationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Doctor specialties distribution
    const specialtyDistribution = await Doctor.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$specialty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        trends: {
          appointments: appointmentsTrend,
          revenue: revenueTrend,
          patients: patientsTrend
        },
        distributions: {
          appointmentStatus: appointmentStatusDistribution,
          consultationType: consultationTypeDistribution,
          doctorSpecialty: specialtyDistribution
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/system-health
// @desc    Get system health metrics
// @access  Private
router.get('/system-health', auth, async (req, res) => {
  try {
    // Database connection status
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

    // Get collection sizes
    const collections = {
      patients: await Patient.countDocuments(),
      doctors: await Doctor.countDocuments(),
      appointments: await Appointment.countDocuments(),
      consultations: await Consultation.countDocuments(),
      invoices: await Invoice.countDocuments(),
      referrals: await Referral.countDocuments()
    };

    // Calculate system metrics
    const totalRecords = Object.values(collections).reduce((sum, count) => sum + count, 0);
    
    // Get recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentActivity = {
      appointments: await Appointment.countDocuments({ createdAt: { $gte: yesterday } }),
      consultations: await Consultation.countDocuments({ createdAt: { $gte: yesterday } }),
      invoices: await Invoice.countDocuments({ createdAt: { $gte: yesterday } }),
      referrals: await Referral.countDocuments({ createdAt: { $gte: yesterday } })
    };

    // System uptime (mock data - in real implementation, track server start time)
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);

    res.json({
      success: true,
      data: {
        database: {
          status: dbStatus,
          collections,
          totalRecords
        },
        activity: {
          last24Hours: recentActivity
        },
        system: {
          uptime: `${uptimeHours}h ${uptimeMinutes}m`,
          uptimeSeconds: uptime,
          memory: process.memoryUsage(),
          nodeVersion: process.version
        }
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system health',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/alerts
// @desc    Get system alerts and notifications
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = [];

    // Check for overdue appointments
    const now = new Date();
    const overdueAppointments = await Appointment.countDocuments({
      date: { $lt: now },
      status: 'Scheduled'
    });

    if (overdueAppointments > 0) {
      alerts.push({
        type: 'warning',
        title: 'Overdue Appointments',
        message: `${overdueAppointments} appointments are overdue`,
        count: overdueAppointments,
        priority: 'medium'
      });
    }

    // Check for urgent referrals
    const urgentReferrals = await Referral.countDocuments({
      urgency: { $in: ['High', 'Urgent'] },
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    if (urgentReferrals > 0) {
      alerts.push({
        type: 'error',
        title: 'Urgent Referrals',
        message: `${urgentReferrals} urgent referrals need attention`,
        count: urgentReferrals,
        priority: 'high'
      });
    }

    // Check for overdue invoices
    const overdueInvoices = await Invoice.countDocuments({
      dueDate: { $lt: now },
      status: { $nin: ['Paid', 'Cancelled'] }
    });

    if (overdueInvoices > 0) {
      alerts.push({
        type: 'warning',
        title: 'Overdue Invoices',
        message: `${overdueInvoices} invoices are overdue`,
        count: overdueInvoices,
        priority: 'medium'
      });
    }

    // Check for incomplete consultations
    const incompleteConsultations = await Consultation.countDocuments({
      status: 'In Progress',
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Older than 24 hours
    });

    if (incompleteConsultations > 0) {
      alerts.push({
        type: 'info',
        title: 'Incomplete Consultations',
        message: `${incompleteConsultations} consultations have been in progress for over 24 hours`,
        count: incompleteConsultations,
        priority: 'low'
      });
    }

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alerts',
      error: error.message
    });
  }
});

module.exports = router;
