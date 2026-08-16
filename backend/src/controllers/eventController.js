const Event = require('../models/Event');

// 1. CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    return res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// 2. READ ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const { festival_id, event_type } = req.query;
    let query = {};

    if (festival_id) query.festival_id = festival_id;
    if (event_type) query.event_type = event_type;

    const events = await Event.find(query)
      .populate({ path: 'festival_id', select: 'name', strictPopulate: false })
      .sort({ start_time: 1 });

    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. READ SINGLE EVENT BY ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({ path: 'festival_id', select: 'name', strictPopulate: false })
      .populate({ path: 'organizer_id', select: 'name email', strictPopulate: false });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Invalid Event ID format' });
  }
};

// 4. UPDATE EVENT
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
