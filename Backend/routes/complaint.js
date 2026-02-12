const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

router.get('/my-complaints', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.user.id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const complaint = new Complaint({
      user_id: req.user.id,
      title,
      description,
      category: category || 'other'
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;