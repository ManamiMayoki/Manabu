const express = require("express");
const router = express.Router();
const {
  createFestival,
  getFestivals,
  getFestivalById,
  updateFestival,
  deleteFestival
} = require("../controllers/festivalController");

router.route("/")
  .get(getFestivals)
  .post(createFestival);

router.route("/:id")
  .get(getFestivalById)
  .put(updateFestival)
  .delete(deleteFestival);

module.exports = router;