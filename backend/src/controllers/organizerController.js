const Organizer = require('../models/Organizer');

// @desc    Create a new Organizer
// @route   POST /api/organizers
exports.createOrganizer = async (req, res) => {
  try {
    const organizer = new Organizer(req.body);
    await organizer.save();
    res.status(201).json({ success: true, data: organizer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all Organizers
// @route   GET /api/organizers
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.status(200).json({ success: true, count: organizers.length, data: organizers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single Organizer by ID
// @route   GET /api/organizers/:id
exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) {
      return res.status(404).json({ success: false, error: 'Organizer not found' });
    }
    res.status(200).json({ success: true, data: organizer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update Organizer details
// @route   PUT /api/organizers/:id
exports.updateOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!organizer) {
      return res.status(404).json({ success: false, error: 'Organizer not found' });
    }
    res.status(200).json({ success: true, data: organizer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete Organizer
// @route   DELETE /api/organizers/:id
exports.deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndDelete(req.params.id);
    if (!organizer) {
      return res.status(404).json({ success: false, error: 'Organizer not found' });
    }
    res.status(200).json({ success: true, message: 'Organizer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};