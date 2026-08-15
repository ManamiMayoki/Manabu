const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    festival_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Festival',
      required: true
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    event_type: { 
      type: String, 
      enum: ['Exam', 'Cultural', 'Workshop', 'Prize Ceremony', 'Concert', 'Stall', 'Other'],
      default: 'Other'
    },
    venue: {
      name: { type: String, required: true },
      room_no: { type: String }
    },
    start_time: { 
      type: Date, 
      required: true 
    },
    end_time: { 
      type: Date, 
      required: true 
    },
    capacity: { 
      type: Number, 
      default: 0 
    },
    performers_or_guests: [
      { 
        name: { type: String },
        role: { type: String }
      }
    ],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', EventSchema);



