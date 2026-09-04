const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Helper function to generate unique ticket code
const generateTicketCode = () => `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

// 1. CREATE REGISTRATION (Single or Bulk)
// @route   POST /api/registrations
// @access  Protected (Authenticated Users)
exports.createRegistration = async (req, res) => {
  try {
    // A. Bulk Insert Support
    if (Array.isArray(req.body)) {
      const createdRegistrations = [];

      for (const item of req.body) {
        const { email, participantName, event, festival } = item;
        if (!email || !participantName || (!event && !festival)) continue;

        const newRegistration = new Registration({
          ...item,
          user: req.user ? req.user.id : item.user,
          ticketCode: generateTicketCode(),
        });

        const savedDoc = await newRegistration.save();
        createdRegistrations.push(savedDoc);
      }

      return res.status(201).json({
        success: true,
        message: `${createdRegistrations.length} registrations created successfully!`,
        data: createdRegistrations,
      });
    }

    // B. Single Registration
    const { email, participantName, event, festival } = req.body;

    if (!email || !participantName || (!event && !festival)) {
      return res.status(400).json({
        success: false,
        message: 'Participant name, email, and target event/festival reference are required.',
      });
    }

    // Dynamic Capacity Check against Event Model
    if (event) {
      const targetEvent = await Event.findById(event);
      if (!targetEvent) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      if (targetEvent.capacity > 0) {
        const totalRegistered = await Registration.countDocuments({ event });
        if (totalRegistered >= targetEvent.capacity) {
          return res.status(400).json({
            success: false,
            message: `Registration failed. Event '${targetEvent.title}' has reached capacity (${targetEvent.capacity}).`,
          });
        }
      }
    }

    // Duplicate Check by Email & Event ID
    const duplicateQuery = { email: email.toLowerCase() };
    if (event) duplicateQuery.event = event;
    if (festival) duplicateQuery.festival = festival;

    const existingRegistration = await Registration.findOne(duplicateQuery);
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate Registration: This email is already registered for this event.',
      });
    }

    // Attach authenticated user ID if logged in
    const registrationData = {
      ...req.body,
      email: email.toLowerCase(),
      user: req.user ? req.user.id : null,
      ticketCode: generateTicketCode(),
    };

    const newRegistration = new Registration(registrationData);
    const savedDoc = await newRegistration.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful and ticket generated!',
      data: savedDoc,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. READ ALL REGISTRATIONS
// @route   GET /api/registrations
// @access  Protected (Admin, Organizer)
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email role')
      .populate('event', 'title start_time venue event_type')
      .populate('festival', 'name startDate location');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. READ SINGLE REGISTRATION BY ID
// @route   GET /api/registrations/:id
// @access  Protected
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event', 'title start_time venue')
      .populate('festival', 'name startDate');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE REGISTRATION DETAILS
// @route   PUT /api/registrations/:id
// @access  Protected (Admin, Organizer)
exports.updateRegistration = async (req, res) => {
  try {
    const updatedDoc = await Registration.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.status(200).json({ success: true, data: updatedDoc });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 5. ATTENDANCE SCAN SUB-MODULE
// @route   POST /api/registrations/scan-attendance
// @access  Protected (Admin, Organizer)
exports.markAttendance = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode) {
      return res.status(400).json({ success: false, message: 'Ticket code is required.' });
    }

    const registration = await Registration.findOne({ ticketCode });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Invalid Ticket Code.' });
    }

    if (registration.attendanceStatus === 'Attended') {
      return res.status(400).json({
        success: false,
        message: 'Ticket already scanned. Attendance was previously marked.',
      });
    }

    registration.attendanceStatus = 'Attended';
    registration.checkInTime = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully!',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. DELETE REGISTRATION
// @route   DELETE /api/registrations/:id
// @access  Protected (Admin, Organizer)
exports.deleteRegistration = async (req, res) => {
  try {
    const deletedDoc = await Registration.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.status(200).json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};