const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'campuscarpool_jwt_super_secret_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
      phone,
      vehicleInfo,
      bio,
    } = req.body;

    if (!name || !email || !password || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Name, College Email, Password, and Student ID are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      studentId: studentId.trim().toUpperCase(),
      department: department ? department.trim() : 'Information Technology',
      phone: phone ? phone.trim() : '',
      vehicleInfo: vehicleInfo || { vehicleType: 'None', model: '', registrationNumber: '' },
      bio: bio ? bio.trim() : 'College commuter looking for convenient carpooling!',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Student registration successful!',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login student & get token
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both college email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No student account found with this email.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, department, phone, vehicleInfo, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    if (name) user.name = name.trim();
    if (department) user.department = department.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (vehicleInfo) {
      user.vehicleInfo = {
        vehicleType: vehicleInfo.vehicleType || user.vehicleInfo.vehicleType,
        model: vehicleInfo.model !== undefined ? vehicleInfo.model.trim() : user.vehicleInfo.model,
        registrationNumber: vehicleInfo.registrationNumber !== undefined ? vehicleInfo.registrationNumber.trim() : user.vehicleInfo.registrationNumber,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getCurrentUser,
  updateProfile,
};

