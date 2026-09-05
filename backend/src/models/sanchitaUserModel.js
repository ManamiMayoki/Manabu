const mongoose = require('mongoose');

const sanchitaUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  },
  { timestamps: true }
);


module.exports = mongoose.model('SanchitaUser', sanchitaUserSchema, 'sanchita_users');