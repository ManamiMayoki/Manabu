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

// Import Auth Middlewares
const { protect, authorize } = require('../middleware/authMiddleware');

// CRUD Endpoints
router.post('/', protect, createRegistration); // Any logged-in user can register for an event
router.get('/', protect, authorize('admin', 'organizer'), getAllRegistrations); // View all registrations
router.get('/:id', protect, getRegistrationById);
router.put('/:id', protect, authorize('admin', 'organizer'), updateRegistration);
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteRegistration);

// Attendance / QR Scan Check-In Endpoint
router.post('/scan-attendance', protect, authorize('admin', 'organizer'), markAttendance);

module.exports = router;