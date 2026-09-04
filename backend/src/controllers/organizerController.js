const Organizer = require('../models/Organizer');
const User = require('../models/User');

// @desc    Create a new Organizer Profile
// @route   POST /api/organizers
// @access  Protected (Admin, Organizer)
exports.createOrganizer = async (req, res) => {
  try {
    // Determine target user ID
    const userId = req.body.user || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required to create an organizer profile.'
      });
    }

    // Check if an organizer profile already exists for this User
    const existingOrganizer = await Organizer.findOne({ user: userId });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        error: 'Organizer profile already exists for this user.'
      });
    }

    // Explicitly extract payload fields (prevents unwanted fields from being passed)
    const { organizationName, phone, website, bio } = req.body;

    let organizer = await Organizer.create({
      user: userId,
      organizationName,
      phone,
      website,
      bio
    });

    // Populate associated User details in response
    organizer = await organizer.populate('user', 'name email role');

    return res.status(201).json({ success: true, data: organizer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry detected for unique constraint.'
      });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all Organizers
// @route   GET /api/organizers
// @access  Public
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find().populate('user', 'name email role');

    return res.status(200).json({
      success: true,
      count: organizers.length,
      data: organizers
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single Organizer by ID
// @route   GET /api/organizers/:id
// @access  Public
exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).populate('user', 'name email role');

    if (!organizer) {
      return res.status(404).json({ success: false, error: 'Organizer profile not found' });
    }
    return res.status(200).json({ success: true, data: organizer });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update Organizer details
// @route   PUT /api/organizers/:id
// @access  Protected (Admin, Organizer)
exports.updateOrganizer = async (req, res) => {
  try {
    let organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({ success: false, error: 'Organizer profile not found' });
    }

    // Ensure user is updating their own profile (or is an Admin)
    if (req.user.role !== 'admin' && organizer.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this organizer profile.' });
    }

    const { organizationName, phone, website, bio } = req.body;

    organizer = await Organizer.findByIdAndUpdate(
      req.params.id,
      { organizationName, phone, website, bio },
      { new: true, runValidators: true }
    ).populate('user', 'name email role');

    return res.status(200).json({ success: true, data: organizer });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete Organizer Profile
// @route   DELETE /api/organizers/:id
// @access  Protected (Admin)
exports.deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({ success: false, error: 'Organizer profile not found' });
    }

    // Ensure user is deleting their own profile or is an Admin
    if (req.user.role !== 'admin' && organizer.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this organizer profile.' });
    }

    await organizer.deleteOne();

    return res.status(200).json({ success: true, message: 'Organizer profile deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};