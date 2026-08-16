const Festival = require("../models/Festival");

// @desc    Create a new festival
// @route   POST /api/festivals
exports.createFestival = async (req, res) => {
  try {
    const festival = await Festival.create(req.body);
    res.status(201).json({ success: true, data: festival });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all festivals with optional search/filtering
// @route   GET /api/festivals
exports.getFestivals = async (req, res) => {
  try {
    const { status, type, city } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (city) query["location.city"] = new RegExp(city, "i");

    const festivals = await Festival.find(query).populate("organizer", "name email");
    res.status(200).json({ success: true, count: festivals.length, data: festivals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single festival by ID
// @route   GET /api/festivals/:id
exports.getFestivalById = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id).populate("organizer");
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