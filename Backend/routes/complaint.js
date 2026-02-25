const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Complaint = require("../models/Complaint");
const { getMyComplaints } = require('../controllers/complaintController');

router.get('/my', protect, getMyComplaints);

// Get My Complaints
router.get("/my-complaints", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create Complaint
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = await Complaint.create({
      user_id: req.user.id,
      title,
      description,
      category: category || "other",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
