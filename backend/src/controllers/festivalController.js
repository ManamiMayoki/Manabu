const Festival = require("../models/Festival");
const Organizer = require("../models/Organizer");

// @desc    Create a new festival
// @route   POST /api/festivals
// @access  Protected (Admin, Organizer)
exports.createFestival = async (req, res) => {
  try {
    // If an organizer is creating this, automatically attach their Organizer profile ID
    if (req.user && req.user.role === "organizer" && !req.body.organizer) {
      const organizerProfile = await Organizer.findOne({ user: req.user.id });
      if (organizerProfile) {
        req.body.organizer = organizerProfile._id;
      }
    }

    const festival = await Festival.create(req.body);
    res.status(201).json({ success: true, data: festival });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all festivals with optional search/filtering
// @route   GET /api/festivals
// @access  Public
exports.getFestivals = async (req, res) => {
  try {
    const { status, type, city } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (city) query["location.city"] = new RegExp(city, "i");

    const festivals = await Festival.find(query)
      .populate("organizer", "organizationName phone website")
      .populate("events"); // Populates array of child events

    res.status(200).json({ success: true, count: festivals.length, data: festivals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single festival by ID (with all linked events)
// @route   GET /api/festivals/:id
// @access  Public
exports.getFestivalById = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id)
      .populate("organizer", "organizationName phone website bio")
      .populate("events"); // Includes linked events via Virtual Populate

    if (!festival) {
      return res.status(404).json({ success: false, message: "Festival not found" });
    }

    res.status(200).json({ success: true, data: festival });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update festival
// @route   PUT /api/festivals/:id
// @access  Protected (Admin, Organizer)
exports.updateFestival = async (req, res) => {
  try {
    const festival = await Festival.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!festival) {
      return res.status(404).json({ success: false, message: "Festival not found" });
    }

    res.status(200).json({ success: true, data: festival });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete festival
// @route   DELETE /api/festivals/:id
// @access  Protected (Admin, Organizer)
exports.deleteFestival = async (req, res) => {
  try {
    const festival = await Festival.findByIdAndDelete(req.params.id);

    if (!festival) {
      return res.status(404).json({ success: false, message: "Festival not found" });
    }

    res.status(200).json({ success: true, message: "Festival deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};