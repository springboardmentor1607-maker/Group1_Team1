const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

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

module.exports = router;