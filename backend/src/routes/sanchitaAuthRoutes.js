const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers } = require('../controllers/sanchitaAuthController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);


router.get('/me', protect, getMe);


router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;