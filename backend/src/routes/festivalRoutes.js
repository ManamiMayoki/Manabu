const express = require("express");
const router = express.Router();
const {
  createFestival,
  getFestivals,
  getFestivalById,
  updateFestival,
  deleteFestival
} = require("../controllers/festivalController");

// Import Auth and RBAC Middlewares
const { protect, authorize } = require("../middleware/authMiddleware");

// Routes for /api/festivals
router.route("/")
  .get(getFestivals) // Public: Anyone can view all festivals
  .post(protect, authorize("admin", "organizer"), createFestival); // Protected: Only Admin & Organizer

// Routes for /api/festivals/:id
router.route("/:id")
  .get(getFestivalById) // Public: Anyone can view a specific festival
  .put(protect, authorize("admin", "organizer"), updateFestival) // Protected: Only Admin & Organizer
  .delete(protect, authorize("admin", "organizer"), deleteFestival); // Protected: Only Admin & Organizer

module.exports = router;