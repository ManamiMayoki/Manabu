const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    // Platform User account (Optional to allow guest participation)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Specific event or festival being registered for
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null
    },
    festival: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Festival',
      default: null
    },

    // Participant Details
    participantName: {
      type: String,
      required: [true, 'Participant name is required'],
      trim: true
    },
    participantType: {
      type: String,
      enum: ['Student', 'Professional', 'Guest', 'Faculty'],
      default: 'Student'
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    institutionOrOrg: {
      type: String,
      trim: true
    },

    // Ticket Details
    ticketType: {
      type: String,
      enum: ['Regular', 'VIP', 'StudentPass', 'EarlyBird'],
      default: 'Regular'
    },
    ticketCode: {
      type: String,
      unique: true,
      sparse: true // Allows null/undefined values without throwing duplicate key errors
    },

    // Payment Details
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    },

    // Attendance Tracker
    attendanceStatus: {
      type: String,
      enum: ['Absent', 'Attended'],
      default: 'Absent'
    },
    checkInTime: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Registration', registrationSchema);