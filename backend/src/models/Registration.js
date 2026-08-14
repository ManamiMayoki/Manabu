const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Participant Details (Supports Students, Professionals, Guests, etc.)
  participantName: {
    type: String,
    required: [true, 'Participant name is required'],
    trim: true,
  },
  participantType: {
    type: String,
    enum: ['Student', 'Professional', 'Guest', 'Faculty'],
    default: 'Student',
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  institutionOrOrg: {
    type: String,
    trim: true,
  },

  // Event Context
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
  },

  // Ticket Sub-Module
  ticketType: {
    type: String,
    enum: ['Regular', 'VIP', 'StudentPass', 'EarlyBird'],
    default: 'Regular',
  },
  ticketCode: {
    type: String,
    unique: true,
  },

  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending',
  },

  // Attendance Sub-Module
  attendanceStatus: {
    type: String,
    enum: ['Absent', 'Attended'],
    default: 'Absent',
  },
  checkInTime: {
    type: Date,
    default: null,
  },

  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Registration', registrationSchema);