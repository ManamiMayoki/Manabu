const Event = require('../models/Event');
const Festival = require('../models/Festival');
const Organizer = require('../models/Organizer');

// 1. CREATE EVENT
// @route   POST /api/events
// @access  Protected (Admin, Organizer)
exports.createEvent = async (req, res) => {
  try {
    const { festival_id } = req.body;

    // Verify associated festival exists
    if (festival_id) {
      const festivalExists = await Festival.findById(festival_id);
      if (!festivalExists) {
        return res.status(404).json({ success: false, error: 'Associated festival not found.' });
      }
    }

    // Automatically assign organizer_id if created by an organizer user
    if (req.user && req.user.role === 'organizer' && !req.body.organizer_id) {
      const organizerProfile = await Organizer.findOne({ user: req.user.id });
      if (organizerProfile) {
        req.body.organizer_id = organizerProfile._id;
      }
    }

    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    return res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// 2. READ ALL EVENTS
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { festival_id, event_type } = req.query;
    let query = {};

    if (festival_id) query.festival_id = festival_id;
    if (event_type) query.event_type = event_type;

    const events = await Event.find(query)
      .populate('festival_id', 'name startDate endDate location')
      .populate('organizer_id', 'organizationName phone website')
      .sort({ start_time: 1 });

    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. READ SINGLE EVENT BY ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('festival_id', 'name startDate endDate location')
      .populate('organizer_id', 'organizationName phone website bio');

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Invalid Event ID format' });
  }
};

// 4. UPDATE EVENT
// @route   PUT /api/events/:id
// @access  Protected (Admin, Organizer)
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// 5. DELETE EVENT
// @route   DELETE /api/events/:id
// @access  Protected (Admin, Organizer)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};