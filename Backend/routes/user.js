const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// ✅ GET current user's full profile (used by frontend after login)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      _id:          user._id,
      name:         user.name,
      username:     user.username  || "",
      email:        user.email,
      phone:        user.phone     || "",
      location:     user.location  || user.address || "",
      bio:          user.bio       || "",
      role:         user.role,
      profilePhoto: user.profilePhoto,
      createdAt:    user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE own profile
router.put('/profile', protect, updateProfile);

// ✅ GET all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET single user by ID (admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Change user role (admin only)
router.patch('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete user (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
