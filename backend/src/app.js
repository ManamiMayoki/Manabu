const express = require('express');
const registrationRoutes = require('./routes/registrationRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const eventRoutes = require('./routes/eventRoutes');
const organizerRoutes = require('./routes/organizerRoutes');

const app = express();
app.use(express.json());

// API Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizers', organizerRoutes);

module.exports = app;