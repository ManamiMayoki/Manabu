const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Import Auth Middlewares
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEvents) // Public
  .post(protect, authorize('admin', 'organizer'), createEvent); // Protected

router.route('/:id')
  .get(getEventById) // Public
  .put(protect, authorize('admin', 'organizer'), updateEvent) // Protected
  .delete(protect, authorize('admin', 'organizer'), deleteEvent); // Protected

module.exports = router;