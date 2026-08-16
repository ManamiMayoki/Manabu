const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  markAttendance,
  deleteRegistration,
} = require('../controllers/registrationController');

// CRUD Endpoints
router.post('/', createRegistration);
router.get('/', getAllRegistrations);
router.get('/:id', getRegistrationById);
router.put('/:id', updateRegistration);
router.delete('/:id', deleteRegistration);

// Attendance / QR Scan Check-In Endpoint
router.post('/scan-attendance', markAttendance);

module.exports = router;