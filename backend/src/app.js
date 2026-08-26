const express = require('express');
const authMiddleware = require('./middleware/authMiddleware');

const registrationRoutes = require('./routes/registrationRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const eventRoutes = require('./routes/eventRoutes');
const organizerRoutes = require('./routes/organizerRoutes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Global Authentication Middleware (Protects all routes below it)
app.use(authMiddleware);

// API Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizers', organizerRoutes);

module.exports = app;