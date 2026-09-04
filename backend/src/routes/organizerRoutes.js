const express = require('express');
const router = express.Router();
const {
  createOrganizer,
  getAllOrganizers,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
} = require('../controllers/organizerController');

// Import Auth Middlewares
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes for /api/organizers
router.route('/')
  .get(getAllOrganizers) // Public: Anyone can view list of organizers
  .post(protect, authorize('admin', 'organizer'), createOrganizer); // Protected

// Routes for /api/organizers/:id
router.route('/:id')
  .get(getOrganizerById) // Public: Anyone can view an organizer profile
  .put(protect, authorize('admin', 'organizer'), updateOrganizer) // Protected: Profile Owner or Admin
  .delete(protect, authorize('admin', 'organizer'), deleteOrganizer); // Protected: Profile Owner or Admin

module.exports = router;