const rateLimit = require('express-rate-limit');

const isEnabled = () => {
  const raw = process.env.RATE_LIMIT_ENABLED;
  if (raw === undefined || raw === '') return true; // default on
  const normalized = raw.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'disabled';
};

// Skip wrapper: lets you pass a real limiter through, or bypass it entirely
const conditional = (limiter) => (req, res, next) => {
  if (!isEnabled()) return next();
  return limiter(req, res, next);
};

const authLimiterCore = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});

const generalLimiterCore = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

exports.authLimiter = conditional(authLimiterCore);
exports.generalLimiter = conditional(generalLimiterCore);