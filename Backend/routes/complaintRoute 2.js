const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const upload = require("../config/multer");

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const {
      user_id,
      title,
      description,
      latitude,
      longitude,
      address,
      assigned_to,
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Location coordinates are required",
      });
    }

    const complaint = new Complaint({
      user_id,
      title,
      description,

      // Store uploaded image path
      photo: req.file ? `/uploads/${req.file.filename}` : null,

      location_coords: {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude),
        ],
      },

      address,
      assigned_to: assigned_to || null,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;