const User = require('../models/User');
const Organizer = require('../models/Organizer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// ==========================================
// MEMBER 2 TASK: USER REGISTRATION
// ==========================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organizationName, phone, website, bio } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Assign role (default to 'user' if invalid role provided)
    const assignedRole = ['admin', 'organizer', 'user'].includes(role) ? role : 'user';

    // 5. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    // 6. If role is 'organizer', automatically create an Organizer profile
    let organizerProfile = null;
    if (assignedRole === 'organizer') {
      organizerProfile = await Organizer.create({
        user: user._id,
        organizationName: organizationName || `${name}'s Organization`,
        phone: phone || '',
        website: website || '',
        bio: bio || '',
      });
    }

    // 7. Generate Token
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizerProfileId: organizerProfile ? organizerProfile._id : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MEMBER 3 TASK: USER LOGIN
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // 4. Generate Token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};