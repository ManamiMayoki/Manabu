// app.js
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

const authRoutes = require('./routes/authRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const sanchitaAuthRoutes = require('./routes/sanchitaAuthRoutes');

const app = express();

// 1. Set security HTTP headers
app.use(helmet());

// 2. Rate limiting to prevent brute-force attacks and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// 3. Configure CORS with restricted origin whitelist
const allowedOrigins = [
  'https://maorii.me',
  'https://www.maorii.me',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: Origin not allowed.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 4. Body parser with strict payload size limit (10kb)
app.use(express.json({ limit: '10kb' }));

// 5. Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// 6. Custom XSS middleware to clean script injection attempts in strings
app.use((req, res, next) => {
  if (req.body) {
    for (let key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

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