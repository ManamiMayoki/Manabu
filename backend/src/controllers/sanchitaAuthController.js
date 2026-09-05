const bcrypt = require('bcryptjs');
const SanchitaUser = require('../models/sanchitaUserModel');
const { signToken } = require('../utils/sanchitaJwt');


const register = async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({ errCode: 210, errMsg: 'Invalid JSON body' });
    }

    const { username, email, password } = body;

    const cleanUsername = typeof username === 'string' ? username.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanUsername) {
      return res.status(400).json({ errCode: 211, errMsg: 'Username is required' });
    }
    if (cleanUsername.length < 3) {
      return res.status(400).json({ errCode: 212, errMsg: 'Username must be at least 3 characters' });
    }
    if (cleanUsername.length > 100) {
      return res.status(400).json({ errCode: 213, errMsg: 'Username must be at most 100 characters' });
    }

    if (!cleanEmail) {
      return res.status(400).json({ errCode: 214, errMsg: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ errCode: 215, errMsg: 'Invalid email format' });
    }

    if (!cleanPassword) {
      return res.status(400).json({ errCode: 216, errMsg: 'Password is required' });
    }
    if (cleanPassword.length < 6) {
      return res.status(400).json({ errCode: 217, errMsg: 'Password must be at least 6 characters' });
    }
    if (cleanPassword.length > 255) {
      return res.status(400).json({ errCode: 218, errMsg: 'Password must be at most 255 characters' });
    }

    const existingByEmail = await SanchitaUser.findOne({ email: cleanEmail });
    if (existingByEmail) {
      return res.status(409).json({ errCode: 219, errMsg: 'Email already registered' });
    }
    const existingByUsername = await SanchitaUser.findOne({ username: cleanUsername });
    if (existingByUsername) {
      return res.status(409).json({ errCode: 220, errMsg: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    
    const newUser = await SanchitaUser.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: 'user',
    });

    const token = signToken({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ errCode: 222, errMsg: 'Failed to register user due to internal server error' });
  }
};


const login = async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({ errCode: 230, errMsg: 'Invalid JSON body' });
    }

    const identifierRaw = body.email ?? body.username ?? body.identifier ?? '';
    const passwordRaw = body.password ?? '';

    const identifier = typeof identifierRaw === 'string' ? identifierRaw.trim() : '';
    const password = typeof passwordRaw === 'string' ? passwordRaw : '';

    if (!identifier) {
      return res.status(400).json({ errCode: 231, errMsg: 'Email or username is required' });
    }
    if (!password) {
      return res.status(400).json({ errCode: 232, errMsg: 'Password is required' });
    }

    const user = await SanchitaUser.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({ errCode: 233, errMsg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errCode: 233, errMsg: 'Invalid credentials' });
    }

    const token = signToken({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ errCode: 234, errMsg: 'Failed to login due to internal server error' });
  }
};


const getMe = async (req, res) => {
  try {
    const payload = req.user;
    if (!payload) {
      return res.status(401).json({ errCode: 200, errMsg: 'Unauthorized' });
    }

    const user = await SanchitaUser.findById(payload.id).select('-password');
    if (!user) {
      return res.status(404).json({ errCode: 235, errMsg: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ errCode: 236, errMsg: 'Failed to fetch user' });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await SanchitaUser.find().select('-password');
    return res.status(200).json({ count: users.length, users });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    return res.status(500).json({ errCode: 237, errMsg: 'Failed to fetch users' });
  }
};

module.exports = { register, login, getMe, getAllUsers };