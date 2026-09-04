// app.js
const express = require('express');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const organizerRoutes = require('./routes/organizerRoutes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Health Check / Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running successfully.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/organizers', organizerRoutes);

module.exports = app;
