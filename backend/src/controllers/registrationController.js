const Registration = require('../models/Registration');

// Configuration Constant
const EVENT_MAX_CAPACITY = 100;

// 1. CREATE REGISTRATION (Single or Array)
exports.createRegistration = async (req, res) => {
  try {
    // Array / Bulk Insert Support
    if (Array.isArray(req.body)) {
      const createdRegistrations = [];

      for (const item of req.body) {
        const { email, eventName, participantName } = item;
        if (!email || !eventName || !participantName) continue;

        const generatedTicketCode = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
        const newRegistration = new Registration({
          ...item,
          ticketCode: generatedTicketCode,
        });

        const savedDoc = await newRegistration.save();
        createdRegistrations.push(savedDoc);
      }

      return res.status(201).json({
        success: true,
        message: `${createdRegistrations.length} Registrations created successfully!`,
        data: createdRegistrations,
      });
    }

    // Single Registration
    const { email, eventName, participantName } = req.body;

    if (!email || !eventName || !participantName) {
      return res.status(400).json({
        success: false,
        message: 'Participant name, email, and event name are required.',
      });
    }

    // Capacity Check
    const totalRegistered = await Registration.countDocuments({ eventName });
    if (totalRegistered >= EVENT_MAX_CAPACITY) {
      return res.status(400).json({
        success: false,
        message: `Registration failed. Event '${eventName}' has reached maximum capacity (${EVENT_MAX_CAPACITY}).`,
      });
    }

    // Duplicate Check
    const existingRegistration = await Registration.findOne({ email, eventName });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate Registration: This email has already registered for this event.',
      });
    }

    // Generate Unique Ticket Code
    const generatedTicketCode = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRegistration = new Registration({
      ...req.body,
      ticketCode: generatedTicketCode,
    });

    const savedDoc = await newRegistration.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful and Ticket generated!',
      data: savedDoc,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. READ ALL REGISTRATIONS
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find();
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
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE REGISTRATION DETAILS
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

// 5. ATTENDANCE SUB-MODULE
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
      message: 'Attendance marked successfully via QR scan!',
      data: registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. DELETE REGISTRATION
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