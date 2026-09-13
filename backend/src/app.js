// app.js
const express = require('express');


const authRoutes = require('./routes/authRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const sanchitaAuthRoutes = require('./routes/sanchitaAuthRoutes');

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running successfully.' });
});


app.use('/api/auth', authRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/sanchita/auth', sanchitaAuthRoutes);

module.exports = app;
