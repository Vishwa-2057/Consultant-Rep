const express = require("express");
const Patient = require("../models/Patient");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Add patient
router.post("/", auth, async (req, res) => {
  try {
    // Extract patient and user fields from request body
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      maritalStatus,
      aadhaarNumber,
      mobileNumber,
      attenderName,
      attenderRelationship,
      attenderEmail,
      attenderMobile,
      attenderWhatsapp,
      city,
      nationality,
      pinCode,
      modeOfCare,
    } = req.body;

    // Create User document (minimal fields)
    const User = require("../models/User");
    const user = new User({
      firstName,
      lastName,
      email: attenderEmail || "",
      phone: mobileNumber,
      gender,
      dateOfBirth,
      aadhaarNumber,
      city,
      nationality,
      pinCode,
    });
    await user.save();

    // Create Patient document
    const patient = new Patient({
      userId: user._id,
      clinicId: req.user.clinicId,
      dateOfBirth,
      gender,
      emergencyContact: {
        name: attenderName,
        relationship: attenderRelationship,
        phone: attenderMobile,
      },
      maritalStatus,
      aadhaarNumber,
      attenderEmail,
      attenderMobile,
      attenderWhatsapp,
      city,
      nationality,
      pinCode,
      modeOfCare,
    });
    await patient.save();

    res.json({ success: true, message: "Patient added successfully", patient });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add patient",
        error: error.message,
      });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const filter = {};

    if (req.user.role !== "super_master_admin") {
      filter.clinicId = req.user.clinicId;
    }

    const patients = await Patient.find(filter)
      .populate("userId", "firstName lastName email phone")
      .populate("clinicId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, patients });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch patients",
        error: error.message,
      });
  }
});

// Get patient by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("userId", "firstName lastName email phone")
      .populate("clinicId", "name")
      .populate("medications.prescribedBy", "firstName lastName");

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch patient",
        error: error.message,
      });
  }
});

// Update patient
router.put("/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("userId", "firstName lastName email phone")
      .populate("clinicId", "name");

    res.json({
      success: true,
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update patient",
        error: error.message,
      });
  }
});

module.exports = router;
