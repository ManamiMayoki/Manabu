const express = require('express');
const router = express.Router();
const {
  createOrganizer,
  getAllOrganizers,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
} = require('../controllers/organizerController');

router.route('/')
  .post(createOrganizer)
  .get(getAllOrganizers);

router.route('/:id')
  .get(getOrganizerById)
  .put(updateOrganizer)
  .delete(deleteOrganizer);

module.exports = router;